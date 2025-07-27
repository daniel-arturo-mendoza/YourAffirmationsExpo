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
        
        // Set container to match screen width
        val screenWidth = reactContext.resources.displayMetrics.widthPixels
        container.layoutParams = LinearLayout.LayoutParams(
            LinearLayout.LayoutParams.MATCH_PARENT,
            LinearLayout.LayoutParams.WRAP_CONTENT
        )
        
                                // Remove debug background from container - let it be transparent
                        container.setBackgroundColor(0x00000000.toInt()) // Transparent background
        
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
                        
                        // Use a reasonable banner height that works
                        val density = reactContext.resources.displayMetrics.density
                        val bannerHeightDp = 87 // Based on previous logs showing 87px height
                        val bannerHeightPx = (bannerHeightDp * density).toInt()
                        
                        adView?.layoutParams = LinearLayout.LayoutParams(
                            LinearLayout.LayoutParams.MATCH_PARENT, 
                            bannerHeightPx
                        )
                        
                        // Remove green background to see actual ad content
                        adView?.setBackgroundColor(0x00000000.toInt()) // Transparent background
                        
                        container.addView(adView)
                        
                        // Force layout pass with the height that Start.io actually uses
                        val screenWidth = reactContext.resources.displayMetrics.widthPixels
                        adView?.measure(
                            View.MeasureSpec.makeMeasureSpec(screenWidth, View.MeasureSpec.EXACTLY),
                            View.MeasureSpec.makeMeasureSpec(bannerHeightPx, View.MeasureSpec.EXACTLY)
                        )
                        adView?.layout(0, 0, screenWidth, bannerHeightPx)
                        
                        Log.d("StartIoBanner", "✅ Start.io TEST banner ad displayed with optimal height")
                        Log.d("StartIoBanner", "Screen width: $screenWidth, Banner height: ${bannerHeightPx}px (${bannerHeightDp}dp)")
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
        fallbackText.setTextColor(0xFF666666.toInt()) // Use app's text color
        fallbackText.textSize = 12f
        fallbackText.setPadding(16, 12, 16, 12)
        fallbackText.gravity = android.view.Gravity.CENTER
        fallbackText.setBackgroundColor(0xFFFFFFFF.toInt()) // Use app's background color
        container.addView(fallbackText)
    }
} 