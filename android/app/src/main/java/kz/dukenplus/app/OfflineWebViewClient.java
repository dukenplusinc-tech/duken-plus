package kz.dukenplus.app;

import android.graphics.Bitmap;
import android.net.http.SslError;
import android.webkit.SslErrorHandler;
import android.webkit.WebResourceError;
import android.webkit.WebResourceRequest;
import android.webkit.WebView;
import android.webkit.WebViewClient;

public class OfflineWebViewClient extends WebViewClient {
    private final MainActivity activity;

    public OfflineWebViewClient(MainActivity activity) {
        this.activity = activity;
    }
    
    @Override
    public void onPageStarted(WebView view, String url, Bitmap favicon) {
        super.onPageStarted(view, url, favicon);
        // Check connectivity when page starts loading
        if (!NetworkUtils.isNetworkAvailable(activity)) {
            activity.showOfflineScreen();
        }
    }
    
    @Override
    public void onPageFinished(WebView view, String url) {
        super.onPageFinished(view, url);
        // Hide offline screen if page loaded successfully
        activity.hideOfflineScreen();
    }
    
    @Override
    public void onReceivedError(WebView view, WebResourceRequest request, WebResourceError error) {
        super.onReceivedError(view, request, error);
        // Show offline screen on network errors
        if (request.isForMainFrame()) {
            activity.showOfflineScreen();
        }
    }
    
    @Override
    public void onReceivedSslError(WebView view, SslErrorHandler handler, SslError error) {
        // For development, you might want to proceed anyway
        // In production, you should handle this more carefully
        handler.proceed();
    }
}
