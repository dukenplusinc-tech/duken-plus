package kz.dukenplus.app;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.net.ConnectivityManager;
import android.net.NetworkInfo;

public class NetworkStateReceiver extends BroadcastReceiver {
    private final MainActivity activity;
    private final String serverUrl;
    
    public NetworkStateReceiver(MainActivity activity, String serverUrl) {
        this.activity = activity;
        this.serverUrl = serverUrl;
    }
    
    @Override
    public void onReceive(Context context, Intent intent) {
        if (intent.getAction() != null && 
            intent.getAction().equals(ConnectivityManager.CONNECTIVITY_ACTION)) {
            
            // Check connectivity on background thread
            new Thread(() -> {
                boolean isConnected = NetworkUtils.isNetworkAvailable(context) && 
                                    NetworkUtils.isServerReachable(serverUrl);
                
                activity.runOnUiThread(() -> {
                    if (!isConnected) {
                        activity.showOfflineScreen();
                    } else {
                        // Only hide if we're currently showing offline screen
                        // Don't interrupt normal browsing
                        if (activity.isOfflineScreenVisible()) {
                            activity.hideOfflineScreen();
                            // Reload to get fresh content
                            activity.reloadWebView();
                        }
                    }
                });
            }).start();
        }
    }
}
