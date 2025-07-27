package com.anonymous.YourAffirmationsExpo

import android.util.Log
import android.view.View
import android.widget.FrameLayout
import android.widget.LinearLayout
import android.widget.TextView
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.Promise
import com.facebook.react.uimanager.SimpleViewManager
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.uimanager.annotations.ReactProp
import com.startapp.sdk.ads.banner.Banner
import com.startapp.sdk.ads.banner.BannerRequest
import com.startapp.sdk.ads.banner.BannerFormat

class StartIoModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {
    init {
        Log.d("StartIoModule", "🚀 StartIoModule constructor called")
    }
    
    override fun getName(): String {
        return "StartIoModule"
    }

    @ReactMethod
    fun loadBannerAd(promise: Promise) {
        try {
            Log.d("StartIoModule", "✅ Start.io banner ad load initiated")
            promise.resolve(true)
        } catch (e: Exception) {
            Log.e("StartIoModule", "❌ Error loading Start.io banner: ${e.message}")
            promise.reject("ERROR", "Failed to load banner: ${e.message}")
        }
    }
}

class StartIoBannerViewManager : SimpleViewManager<LinearLayout>() {
    private var adView: View? = null
    
    init {
        Log.d("StartIoBanner", "🚀 StartIoBannerViewManager constructor called")
    }
    
    override fun getName(): String {
        return "StartIoBanner"
    }

    override fun createViewInstance(reactContext: ThemedReactContext): LinearLayout {
        Log.d("StartIoBanner", "🔄 Creating Start.io banner view instance...")
        
        val container = LinearLayout(reactContext)
        container.orientation = LinearLayout.VERTICAL
        
        try {
            // Show loading state first
            showLoadingBanner(container, reactContext)
            
            Log.d("StartIoBanner", "🔄 Creating BannerRequest...")
            
            // Use the new SDK v5 approach for banner ads with TEST MODE
            val bannerRequest = BannerRequest(reactContext)
            Log.d("StartIoBanner", "✅ BannerRequest created")
            
            bannerRequest.setAdFormat(BannerFormat.BANNER)
            Log.d("StartIoBanner", "✅ Ad format set to BANNER")
            
            bannerRequest.load { creator, error ->
                Log.d("StartIoBanner", "🔄 Banner load callback received")
                Log.d("StartIoBanner", "Creator: $creator")
                Log.d("StartIoBanner", "Error: $error")
                
                if (creator != null) {
                    Log.d("StartIoBanner", "✅ Start.io TEST banner ad creator received")
                    adView = creator.create(reactContext, null)
                    Log.d("StartIoBanner", "✅ TEST ad view created: $adView")
                    
                    // Update UI on main thread using post
                    container.post {
                        container.removeAllViews()
                        
                        // Hardcode dimensions for testing
                        adView?.layoutParams = LinearLayout.LayoutParams(972, 100) // Hardcoded width and height
                        adView?.setBackgroundColor(0xFFFF0000.toInt()) // Red background
                        
                        container.addView(adView)
                        
                        // Force layout pass
                        adView?.measure(
                            View.MeasureSpec.makeMeasureSpec(972, View.MeasureSpec.EXACTLY),
                            View.MeasureSpec.makeMeasureSpec(100, View.MeasureSpec.EXACTLY)
                        )
                        adView?.layout(0, 0, 972, 100)
                        
                        Log.d("StartIoBanner", "✅ Start.io TEST banner ad displayed with forced layout")
                        Log.d("StartIoBanner", "Ad view dimensions: ${adView?.width} x ${adView?.height}")
                        Log.d("StartIoBanner", "Container dimensions: ${container.width} x ${container.height}")
                    }
                } else {
                    Log.e("StartIoBanner", "❌ Start.io TEST banner ad failed: $error")
                    container.post {
                        showFallbackBanner(container, reactContext)
                    }
                }
            }
            
            Log.d("StartIoBanner", "✅ TEST banner request initiated")
            
        } catch (e: Exception) {
            Log.e("StartIoBanner", "❌ Error creating Start.io banner view: ${e.message}")
            e.printStackTrace()
            showFallbackBanner(container, reactContext)
        }
        
        return container
    }
    
    private fun showLoadingBanner(container: LinearLayout, context: ThemedReactContext) {
        val loadingText = TextView(context)
        loadingText.text = "Loading Start.io Ad..."
        loadingText.setTextColor(0xFF666666.toInt())
        loadingText.textSize = 12f
        loadingText.setPadding(16, 12, 16, 12)
        loadingText.gravity = android.view.Gravity.CENTER
        container.addView(loadingText)
    }
    
    private fun showFallbackBanner(container: LinearLayout, context: ThemedReactContext) {
        container.removeAllViews()
        val fallbackText = TextView(context)
        fallbackText.text = "Start.io Banner Ad"
        fallbackText.setTextColor(0xFFFFFFFF.toInt())
        fallbackText.textSize = 14f
        fallbackText.setPadding(16, 12, 16, 12)
        fallbackText.gravity = android.view.Gravity.CENTER
        fallbackText.setBackgroundColor(0xFF4CAF50.toInt())
        container.addView(fallbackText)
    }
} 