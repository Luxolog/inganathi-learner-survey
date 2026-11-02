package za.co.inganathi.learnersurvey

import android.app.Activity
import android.os.Bundle
import android.webkit.WebChromeClient
import android.webkit.WebView
import android.webkit.WebViewClient
import android.webkit.WebSettings
import android.widget.Toast

class MainActivity : Activity() {
    private lateinit var surveyWebView: WebView

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        surveyWebView = WebView(this)
        surveyWebView.webViewClient = WebViewClient()
        surveyWebView.webChromeClient = WebChromeClient()
        surveyWebView.settings.javaScriptEnabled = true
        surveyWebView.settings.domStorageEnabled = true
        surveyWebView.settings.cacheMode = WebSettings.LOAD_DEFAULT
        surveyWebView.loadUrl("file:///android_asset/index.html")
        setContentView(surveyWebView)
    }

    @Deprecated("Deprecated in Java")
    override fun onBackPressed() {
        if (surveyWebView.canGoBack()) surveyWebView.goBack() else super.onBackPressed()
    }

    override fun onDestroy() {
        surveyWebView.destroy()
        super.onDestroy()
    }
}
