package kz.dukenplus.app;

import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.content.res.Configuration;
import android.content.res.Resources;
import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.webkit.WebView;
import android.widget.ArrayAdapter;
import android.widget.Button;
import android.widget.Spinner;
import android.widget.Toast;

import com.getcapacitor.Bridge;
import com.getcapacitor.BridgeActivity;
import com.getcapacitor.CapConfig;

import java.util.Locale;

public class MainActivity extends BridgeActivity {
    private View offlineScreenView;
    private WebView webView;
    private String serverUrl;
    private Handler mainHandler = new Handler(Looper.getMainLooper());
    private NetworkStateReceiver networkStateReceiver;
    private Runnable autoRefreshRunnable;
    private int refreshCountdown = 5;
    private static final int REFRESH_INTERVAL_SECONDS = 5;
    
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        
        // Detect and set language from OS settings (before other setup)
        // This needs to happen early to ensure resources are loaded in correct language
        if (savedInstanceState == null) {
            detectAndSetLanguage();
        }
        
        // Get server URL from Capacitor config (primary source)
        Bridge bridge = getBridge();
        if (bridge != null) {
            try {
                CapConfig config = bridge.getConfig();
                if (config != null) {
                    String configServerUrl = config.getServerUrl();
                    if (configServerUrl != null && !configServerUrl.isEmpty()) {
                        serverUrl = configServerUrl;
                    }
                }
            } catch (Exception e) {
                // Config should always be available, log error if not
                android.util.Log.e("MainActivity", "Failed to get server URL from Capacitor config", e);
            }
        }
        
        // Ensure serverUrl is set before proceeding
        if (serverUrl == null || serverUrl.isEmpty()) {
            android.util.Log.w("MainActivity", "Server URL not found in config, using fallback");
            // Fallback only if config is truly unavailable
            throw new IllegalStateException("Server URL not found in config and no fallback is allowed.");
        }
        
        // Set up offline screen
        setupOfflineScreen();
        
        // Set up WebView client after bridge is initialized
        if (bridge != null && bridge.getWebView() != null) {
            bridge.getWebView().post(() -> {
                setupWebViewClient();
                checkInitialConnection();
            });
        } else {
            // If bridge not ready, wait a bit and try again
            new Handler(Looper.getMainLooper()).postDelayed(() -> {
                Bridge delayedBridge = getBridge();
                if (delayedBridge != null && delayedBridge.getWebView() != null) {
                    delayedBridge.getWebView().post(() -> {
                        setupWebViewClient();
                        checkInitialConnection();
                    });
                }
            }, 500);
        }
        
        // Register network state receiver
        registerNetworkReceiver();
    }
    
    @Override
    public void onDestroy() {
        super.onDestroy();
        stopAutoRefreshTimer();
        unregisterNetworkReceiver();
    }
    
    private void registerNetworkReceiver() {
        networkStateReceiver = new NetworkStateReceiver(this, serverUrl);
        IntentFilter filter = new IntentFilter();
        filter.addAction(android.net.ConnectivityManager.CONNECTIVITY_ACTION);
        registerReceiver(networkStateReceiver, filter);
    }
    
    private void unregisterNetworkReceiver() {
        if (networkStateReceiver != null) {
            try {
                unregisterReceiver(networkStateReceiver);
            } catch (Exception e) {
                // Receiver might not be registered
            }
        }
    }
    
    private void setupOfflineScreen() {
        LayoutInflater inflater = LayoutInflater.from(this);
        offlineScreenView = inflater.inflate(R.layout.offline_screen, null);
        
        // Add offline screen as overlay to the bridge's root view
        Bridge bridge = getBridge();
        if (bridge != null) {
            ViewGroup bridgeView = (ViewGroup) bridge.getWebView().getParent();
            if (bridgeView != null) {
                bridgeView.addView(offlineScreenView, new ViewGroup.LayoutParams(
                    ViewGroup.LayoutParams.MATCH_PARENT,
                    ViewGroup.LayoutParams.MATCH_PARENT
                ));
                offlineScreenView.setVisibility(View.GONE);
            } else {
                // Fallback to content view
                ViewGroup rootView = findViewById(android.R.id.content);
                if (rootView != null) {
                    rootView.addView(offlineScreenView, new ViewGroup.LayoutParams(
                        ViewGroup.LayoutParams.MATCH_PARENT,
                        ViewGroup.LayoutParams.MATCH_PARENT
                    ));
                    offlineScreenView.setVisibility(View.GONE);
                }
            }
        }
        
        // Setup refresh button
        Button refreshButton = offlineScreenView.findViewById(R.id.refreshButton);
        if (refreshButton != null) {
            refreshButton.setOnClickListener(v -> refreshConnection());
        }
        
        // Setup language switcher
        setupLanguageSwitcher();
    }
    
    private void setupLanguageSwitcher() {
        Spinner languageSpinner = offlineScreenView.findViewById(R.id.languageSpinner);
        if (languageSpinner == null) return;
        
        String[] languages = {"English", "Русский", "Қазақша"};
        String[] languageCodes = {"en", "ru", "kz"};
        
        ArrayAdapter<String> adapter = new ArrayAdapter<>(
            this,
            android.R.layout.simple_spinner_item,
            languages
        );
        adapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item);
        languageSpinner.setAdapter(adapter);
        
        // Set current language
        String currentLang = getCurrentLanguage();
        for (int i = 0; i < languageCodes.length; i++) {
            if (languageCodes[i].equals(currentLang)) {
                languageSpinner.setSelection(i);
                break;
            }
        }
        
        languageSpinner.setOnItemSelectedListener(new android.widget.AdapterView.OnItemSelectedListener() {
            @Override
            public void onItemSelected(android.widget.AdapterView<?> parent, View view, int position, long id) {
                String selectedLang = languageCodes[position];
                if (!selectedLang.equals(getCurrentLanguage())) {
                    changeLanguage(selectedLang);
                }
            }
            
            @Override
            public void onNothingSelected(android.widget.AdapterView<?> parent) {
            }
        });
    }
    
    private void detectAndSetLanguage() {
        // Get OS language
        Locale osLocale = Locale.getDefault();
        String osLang = osLocale.getLanguage();
        
        // Map OS language to supported languages
        String targetLang = "en"; // default
        if (osLang.equals("ru")) {
            targetLang = "ru";
        } else if (osLang.equals("kk") || osLang.equals("kz")) {
            targetLang = "kz";
        }
        
        // Get current app language
        String currentLang = getCurrentLanguage();
        
        // If OS language differs from current app language, change it
        if (!targetLang.equals(currentLang)) {
            changeLanguage(targetLang);
        }
    }
    
    private String getCurrentLanguage() {
        Locale locale = getResources().getConfiguration().locale;
        String lang = locale.getLanguage();
        // Map to supported languages
        if (lang.equals("ru")) return "ru";
        if (lang.equals("kk") || lang.equals("kz")) return "kz";
        return "en";
    }
    
    private void changeLanguage(String languageCode) {
        Locale locale;
        switch (languageCode) {
            case "ru":
                locale = new Locale("ru");
                break;
            case "kz":
                locale = new Locale("kk"); // Kazakh uses "kk" as ISO code
                break;
            default:
                locale = Locale.ENGLISH;
        }
        
        Locale.setDefault(locale);
        Configuration config = getResources().getConfiguration();
        
        if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.N) {
            config.setLocale(locale);
            getResources().updateConfiguration(config, getResources().getDisplayMetrics());
        } else {
            config.locale = locale;
            getResources().updateConfiguration(config, getResources().getDisplayMetrics());
        }
        
        // Restart activity to apply language change
        recreate();
    }
    
    private void setupWebViewClient() {
        webView = getBridge().getWebView();
        if (webView != null) {
            webView.setWebViewClient(new OfflineWebViewClient(this));
        }
    }
    
    private void checkInitialConnection() {
        new Thread(() -> {
            boolean isConnected = NetworkUtils.isNetworkAvailable(this) && 
                                 NetworkUtils.isServerReachable(serverUrl);
            
            mainHandler.post(() -> {
                if (!isConnected) {
                    showOfflineScreen();
                } else {
                    hideOfflineScreen();
                }
            });
        }).start();
    }
    
    public void showOfflineScreen() {
        if (offlineScreenView != null) {
            mainHandler.post(() -> {
                offlineScreenView.setVisibility(View.VISIBLE);
                offlineScreenView.bringToFront();
                // Don't hide WebView, just overlay the offline screen
                // Start auto-refresh timer
                startAutoRefreshTimer();
            });
        }
    }
    
    public void hideOfflineScreen() {
        if (offlineScreenView != null) {
            mainHandler.post(() -> {
                offlineScreenView.setVisibility(View.GONE);
                // Stop auto-refresh timer
                stopAutoRefreshTimer();
            });
        }
    }
    
    private void startAutoRefreshTimer() {
        stopAutoRefreshTimer(); // Stop any existing timer
        refreshCountdown = REFRESH_INTERVAL_SECONDS;
        updateRefreshButtonText();
        
        autoRefreshRunnable = new Runnable() {
            @Override
            public void run() {
                refreshCountdown--;
                
                if (refreshCountdown > 0) {
                    updateRefreshButtonText();
                    mainHandler.postDelayed(this, 1000); // Schedule next update in 1 second
                } else {
                    // Timer reached 0, auto-refresh
                    // refreshConnection() will handle button state and restart timer
                    refreshConnection();
                }
            }
        };
        
        mainHandler.postDelayed(autoRefreshRunnable, 1000); // Start countdown
    }
    
    private void stopAutoRefreshTimer() {
        if (autoRefreshRunnable != null) {
            mainHandler.removeCallbacks(autoRefreshRunnable);
            autoRefreshRunnable = null;
        }
        refreshCountdown = REFRESH_INTERVAL_SECONDS;
        updateRefreshButtonText();
    }
    
    private void updateRefreshButtonText() {
        if (offlineScreenView != null) {
            Button refreshButton = offlineScreenView.findViewById(R.id.refreshButton);
            if (refreshButton != null) {
                String baseText = getString(R.string.offline_refresh);
                if (refreshCountdown > 0 && refreshCountdown < REFRESH_INTERVAL_SECONDS) {
                    refreshButton.setText(baseText + " (" + refreshCountdown + ")");
                } else {
                    refreshButton.setText(baseText);
                }
            }
        }
    }
    
    private void refreshConnection() {
        Button refreshButton = offlineScreenView.findViewById(R.id.refreshButton);
        if (refreshButton != null) {
            refreshButton.setEnabled(false);
            refreshButton.setText(getString(R.string.offline_checking));
        }
        
        // Temporarily stop timer during refresh
        boolean wasTimerRunning = (autoRefreshRunnable != null);
        if (wasTimerRunning) {
            stopAutoRefreshTimer();
        }
        
        new Thread(() -> {
            // Wait a bit before checking to show loading state
            try {
                Thread.sleep(500);
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
            }
            
            boolean isConnected = NetworkUtils.isNetworkAvailable(this) && 
                                 NetworkUtils.isServerReachable(serverUrl);
            
            mainHandler.post(() -> {
                if (refreshButton != null) {
                    refreshButton.setEnabled(true);
                }
                
                if (isConnected) {
                    hideOfflineScreen();
                    // Reload the WebView
                    if (webView != null) {
                        webView.reload();
                    }
                } else {
                    // Still offline, restart timer and update button
                    if (wasTimerRunning) {
                        refreshCountdown = REFRESH_INTERVAL_SECONDS;
                        startAutoRefreshTimer();
                    } else {
                        // Manual refresh - just update button text
                        updateRefreshButtonText();
                    }
                    Toast.makeText(this, getString(R.string.offline_message), 
                        Toast.LENGTH_SHORT).show();
                }
            });
        }).start();
    }
    
    public boolean isOfflineScreenVisible() {
        return offlineScreenView != null && offlineScreenView.getVisibility() == View.VISIBLE;
    }
    
    public void reloadWebView() {
        if (webView != null) {
            webView.reload();
        } else {
            Bridge bridge = getBridge();
            if (bridge != null && bridge.getWebView() != null) {
                bridge.getWebView().reload();
            }
        }
    }
    
    @Override
    public void onBackPressed() {
        // If offline screen is visible, don't allow back press
        if (offlineScreenView != null && offlineScreenView.getVisibility() == View.VISIBLE) {
            return;
        }
        super.onBackPressed();
    }
}
