package tz.co.kilivolabs

import android.app.Activity
import android.app.AlertDialog
import android.app.Dialog
import android.content.Context
import android.graphics.Bitmap
import android.graphics.BitmapFactory
import android.graphics.Canvas
import android.graphics.Color
import android.graphics.Paint
import android.graphics.Path
import android.graphics.Typeface
import android.graphics.LinearGradient
import android.graphics.RadialGradient
import android.graphics.Rect
import android.graphics.RectF
import android.graphics.Shader
import android.graphics.drawable.GradientDrawable
import android.os.Bundle
import android.text.Editable
import android.text.InputType
import android.text.TextWatcher
import android.view.Gravity
import android.view.View
import android.view.WindowManager
import android.widget.CheckBox
import android.widget.EditText
import android.widget.FrameLayout
import android.widget.ImageView
import android.widget.LinearLayout
import android.widget.ProgressBar
import android.widget.ScrollView
import android.widget.TextView

private data class Feature(val icon: Int, val title: String, val subtitle: String)
private data class Division(
    val id: String,
    val title: String,
    val shortTitle: String,
    val subtitle: String,
    val description: String,
    val color: Int,
    val pale: Int,
    val icon: Int,
    val image: Int,
    val section: String,
    val features: List<Feature>
)
private data class NewsItem(
    val title: String,
    val date: String,
    val category: String,
    val image: Int,
    val description: String
)
private data class SearchResult(
    val title: String,
    val subtitle: String,
    val searchableText: String,
    val onClick: () -> Unit
)

class MainActivity : Activity() {
    private val pageBg = Color.rgb(246, 248, 253)
    private val ink = Color.rgb(15, 35, 83)
    private val blue = Color.rgb(15, 76, 207)
    private val navy = Color.rgb(7, 45, 136)
    private val muted = Color.rgb(82, 101, 142)
    private val stroke = Color.rgb(220, 229, 248)
    private val prefs by lazy { getSharedPreferences("kilivo-offline", Context.MODE_PRIVATE) }
    private var divisionFilter = "All"
    private var newsFilter = "All"
    private var donationAmount = "TZS 10,000"

    private val divisions by lazy {
        listOf(
            Division("business", "KILIVO BUSINESS", "Business", "Commerce & More",
                "Explore our business ventures across various industries.",
                Color.rgb(12, 73, 193), Color.rgb(205, 225, 255), R.drawable.ic_business,
                R.drawable.business_buildings, "Business Areas", listOf(
                    Feature(R.drawable.ic_business, "Trading", "Trade and distribution"),
                    Feature(R.drawable.ic_cart, "Retail", "Products and customer service"),
                    Feature(R.drawable.ic_leaf, "Agriculture", "Sustainable agriculture"),
                    Feature(R.drawable.ic_truck, "Logistics", "Movement and delivery"),
                    Feature(R.drawable.ic_building, "Real Estate", "Property and development"),
                    Feature(R.drawable.ic_building, "Hospitality", "Guest and travel services")
                )),
            Division("technology", "KILIVO TECHNOLOGIES", "Technologies", "Tech for a Better World",
                "Innovative solutions, digital products and IT services.",
                Color.rgb(85, 27, 207), Color.rgb(225, 210, 255), R.drawable.ic_technology,
                R.drawable.technology_laptop, "Our Focus Areas", listOf(
                    Feature(R.drawable.ic_code, "Software Development", "Custom systems and applications"),
                    Feature(R.drawable.ic_mobile, "Mobile & Web Apps", "Digital products for every screen"),
                    Feature(R.drawable.ic_support, "IT Consultancy", "Practical technology guidance"),
                    Feature(R.drawable.ic_chip, "AI & Innovation", "Explore emerging technologies"),
                    Feature(R.drawable.ic_technology, "Digital Solutions", "Tools, platforms and integration")
                )),
            Division("projects", "KILIVO PROJECTS", "Projects", "Projects & Opportunities",
                "Find, manage and deliver projects plus connect with opportunities.",
                Color.rgb(0, 137, 111), Color.rgb(194, 238, 224), R.drawable.ic_projects,
                R.drawable.project_site, "What We Do", listOf(
                    Feature(R.drawable.ic_check, "Project Execution", "Deliver work from plan to completion"),
                    Feature(R.drawable.ic_check, "Professional Opportunities", "Connect skills with opportunities"),
                    Feature(R.drawable.ic_check, "Project Management", "Organize teams, time and resources"),
                    Feature(R.drawable.ic_check, "Business Partnerships", "Build practical collaborations")
                )),
            Division("impact", "KILIVO IMPACT", "Impact", "Community & Hope",
                "Social development, charity and community empowerment.",
                Color.rgb(239, 103, 0), Color.rgb(255, 221, 184), R.drawable.ic_impact,
                R.drawable.impact_students, "Our Programs", listOf(
                    Feature(R.drawable.ic_people, "Community Development", "Stronger, more resilient communities"),
                    Feature(R.drawable.ic_people, "Youth Empowerment", "Support young people to thrive"),
                    Feature(R.drawable.ic_book, "Education & Awareness", "Learning and essential knowledge"),
                    Feature(R.drawable.ic_people_heart, "Humanitarian Support", "Care for people in need")
                ))
        )
    }

    private val updates by lazy {
        listOf(
            NewsItem("KILIVO LABS Launches New Tech Initiative", "Nov 8, 2025", "Technology",
                R.drawable.technology_laptop, "KILIVO LABS is expanding access to practical technology and digital skills through a new community initiative."),
            NewsItem("Community Health Outreach Success", "Nov 1, 2025", "Impact",
                R.drawable.impact_students, "Community partners came together to share information and support local wellbeing."),
            NewsItem("New Project Opportunities", "Oct 28, 2025", "Projects",
                R.drawable.project_site, "Explore professional opportunities and projects that connect people, ideas and practical delivery."),
            NewsItem("Tips for Online Safety", "Oct 25, 2025", "Technology",
                R.drawable.technology_laptop, "Simple habits can help you protect your devices, accounts and personal information online."),
            NewsItem("Support Education in Tanzania", "Oct 20, 2025", "Impact",
                R.drawable.impact_students, "Education and awareness programs help create more opportunities for children and families.")
        )
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        showSplash()
    }

    @Suppress("DEPRECATION")
    private fun showSplash() {
        window.setFlags(WindowManager.LayoutParams.FLAG_FULLSCREEN, WindowManager.LayoutParams.FLAG_FULLSCREEN)
        window.decorView.systemUiVisibility = View.SYSTEM_UI_FLAG_HIDE_NAVIGATION or View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY
        val root = FrameLayout(this)
        root.addView(ImageView(this).apply {
            setImageResource(R.drawable.splash_family)
            scaleType = ImageView.ScaleType.CENTER_CROP
            contentDescription = "KILIVO LABS family at sunset"
        }, FrameLayout.LayoutParams(-1, -1))
        root.addView(View(this).apply {
            background = GradientDrawable(GradientDrawable.Orientation.TOP_BOTTOM, intArrayOf(
                Color.argb(18, 3, 23, 81), Color.argb(30, 4, 17, 58), Color.argb(220, 2, 15, 54)
            ))
        }, FrameLayout.LayoutParams(-1, -1))
        val brand = LinearLayout(this).apply { orientation = LinearLayout.VERTICAL; gravity = Gravity.CENTER }
        brand.addView(ImageView(this).apply {
            setImageResource(R.drawable.ic_logo_mark)
            contentDescription = "KILIVO LABS logo"
        }, LinearLayout.LayoutParams(dp(86), dp(86)))
        brand.addView(label("KILIVO LABS", 29, Color.WHITE, Typeface.BOLD).apply { setPadding(0, dp(8), 0, dp(3)) })
        brand.addView(label("Build. Innovate. Empower.", 14, Color.WHITE, Typeface.BOLD))
        root.addView(brand, FrameLayout.LayoutParams(-1, dp(240), Gravity.TOP).apply { topMargin = dp(100) })
        val loading = LinearLayout(this).apply { orientation = LinearLayout.VERTICAL; gravity = Gravity.CENTER }
        loading.addView(ProgressBar(this).apply {
            indeterminateTintList = android.content.res.ColorStateList.valueOf(Color.WHITE)
        }, LinearLayout.LayoutParams(dp(44), dp(44)))
        loading.addView(label("Loading your world...", 12, Color.WHITE, Typeface.NORMAL).apply {
            setPadding(0, dp(10), 0, 0)
        })
        root.addView(loading, FrameLayout.LayoutParams(-1, dp(105), Gravity.BOTTOM))
        setContentView(root)
        root.postDelayed({
            if (prefs.getBoolean("onboarding_complete", false)) showHome() else showWelcome()
        }, 1700)
    }

    @Suppress("DEPRECATION")
    private fun restoreBars() {
        window.clearFlags(WindowManager.LayoutParams.FLAG_FULLSCREEN)
        window.decorView.systemUiVisibility =
            View.SYSTEM_UI_FLAG_LIGHT_STATUS_BAR or View.SYSTEM_UI_FLAG_LIGHT_NAVIGATION_BAR
        window.statusBarColor = pageBg
        window.navigationBarColor = Color.WHITE
    }

    private fun showWelcome() {
        restoreBars()
        window.statusBarColor = Color.TRANSPARENT
        window.navigationBarColor = Color.TRANSPARENT
        val root = FrameLayout(this)
        root.addView(welcomeBackdrop(), FrameLayout.LayoutParams(-1, -1))
        val scroll = ScrollView(this).apply {
            isFillViewport = true
            setBackgroundColor(Color.TRANSPARENT)
        }
        val content = pageContent().apply {
            gravity = Gravity.CENTER_HORIZONTAL
            setPadding(dp(22), dp(56), dp(22), dp(24))
            setBackgroundColor(Color.TRANSPARENT)
        }
        val displayWidth = resources.displayMetrics.widthPixels
        val tileSize = minOf(dp(210), (displayWidth * 0.55f).toInt())

        content.addView(label("Welcome to", 28, Color.rgb(10, 27, 60), Typeface.BOLD))
        content.addView(label("KILIVO LABS", 36, Color.rgb(10, 27, 60), Typeface.BOLD).apply {
            setPadding(0, dp(1), 0, dp(6))
        })
        content.addView(label("One Family. Four Unique Identities.", 16, Color.rgb(10, 27, 60), Typeface.BOLD).apply {
            setPadding(0, 0, 0, dp(6))
        })
        content.addView(label(
            "A diversified enterprise group\ndriving innovation, opportunity\nand social impact.",
            14, Color.rgb(35, 55, 95), Typeface.BOLD
        ).apply {
            gravity = Gravity.CENTER
            setLineSpacing(dp(2).toFloat(), 1f)
            setPadding(dp(16), 0, dp(16), dp(6))
        })
        content.addView(welcomeAccent(), LinearLayout.LayoutParams(dp(72), dp(10)).apply {
            bottomMargin = dp(18)
        })

        // Let the four cards use the available space between the introduction and page controls.
        val gridContainer = FrameLayout(this).apply {
            clipChildren = false
            clipToPadding = false
            val tilesLayout = LinearLayout(this@MainActivity).apply {
                orientation = LinearLayout.VERTICAL
                clipChildren = false
                clipToPadding = false
            }

            val row1 = LinearLayout(this@MainActivity).apply {
                orientation = LinearLayout.HORIZONTAL
                gravity = Gravity.CENTER
                clipChildren = false
                clipToPadding = false
            }
            if (divisions.size >= 2) {
                row1.addView(welcomeTile(divisions[0], tileSize), LinearLayout.LayoutParams(0, -1, 1f))
                row1.addView(welcomeTile(divisions[1], tileSize), LinearLayout.LayoutParams(0, -1, 1f))
            }
            tilesLayout.addView(row1, LinearLayout.LayoutParams(-1, 0, 1f))

            val row2 = LinearLayout(this@MainActivity).apply {
                orientation = LinearLayout.HORIZONTAL
                gravity = Gravity.CENTER
                clipChildren = false
                clipToPadding = false
            }
            if (divisions.size >= 4) {
                row2.addView(welcomeTile(divisions[2], tileSize), LinearLayout.LayoutParams(0, -1, 1f))
                row2.addView(welcomeTile(divisions[3], tileSize), LinearLayout.LayoutParams(0, -1, 1f))
            }
            tilesLayout.addView(row2, LinearLayout.LayoutParams(-1, 0, 1f))

            addView(tilesLayout, FrameLayout.LayoutParams(-1, -1))

            // Center sparkle flare overlay
            val sparkleSize = dp(32)
            addView(centerSparkle(), FrameLayout.LayoutParams(sparkleSize, sparkleSize, Gravity.CENTER))
        }

        gridContainer.minimumHeight = dp(340)
        content.addView(gridContainer, LinearLayout.LayoutParams(-1, 0, 1f).apply {
            bottomMargin = dp(16)
        })

        val pageIndicators = LinearLayout(this).apply {
            orientation = LinearLayout.HORIZONTAL
            gravity = Gravity.CENTER
            setPadding(0, dp(2), 0, dp(6))
            contentDescription = "Welcome page 1 of 4"
        }
        repeat(4) { index ->
            pageIndicators.addView(View(this).apply {
                background = rounded(
                    if (index == 0) blue else Color.rgb(175, 200, 235),
                    50
                )
            }, LinearLayout.LayoutParams(dp(if (index == 0) 9 else 7), dp(if (index == 0) 9 else 7)).apply {
                if (index > 0) marginStart = dp(6)
            })
        }
        content.addView(pageIndicators, LinearLayout.LayoutParams(-1, dp(20)))

        content.addView(primaryButton("Get Started", blue, Color.WHITE, R.drawable.ic_arrow_right) {
            prefs.edit().putBoolean("onboarding_complete", true).apply()
            showHome()
        }, LinearLayout.LayoutParams(-1, dp(54)).apply {
            topMargin = dp(8)
            bottomMargin = dp(8)
        })

        scroll.addView(content, FrameLayout.LayoutParams(-1, -1))
        root.addView(scroll, FrameLayout.LayoutParams(-1, -1))
        setContentView(root)
    }

    private fun welcomeTile(division: Division, tileSize: Int) = FrameLayout(this).apply {
        clipChildren = false
        clipToPadding = false
        isClickable = false
        isFocusable = false
        importantForAccessibility = View.IMPORTANT_FOR_ACCESSIBILITY_NO
        addView(welcomeTileShape(division.id), FrameLayout.LayoutParams(tileSize, tileSize, Gravity.CENTER))

        val content = LinearLayout(this@MainActivity).apply {
            orientation = LinearLayout.VERTICAL
            gravity = Gravity.CENTER
            isClickable = false
            isFocusable = false
        }
        val welcomeIcon = when (division.id) {
            "technology" -> R.drawable.ic_code
            "projects" -> R.drawable.ic_welcome_hardhat
            "impact" -> R.drawable.ic_welcome_impact
            else -> division.icon
        }
        content.addView(icon(welcomeIcon, Color.WHITE, 40).apply {
            setPadding(0, 0, 0, dp(2))
        })
        content.addView(label("KILIVO", 13, Color.WHITE, Typeface.BOLD).apply {
            setPadding(0, dp(1), 0, 0)
        })
        content.addView(label(division.shortTitle.uppercase(), 12, Color.WHITE, Typeface.BOLD))
        addView(content, FrameLayout.LayoutParams(-1, -1, Gravity.CENTER))
    }

    private fun welcomeTileShape(divisionId: String) = object : View(this) {
        private val paint = Paint(Paint.ANTI_ALIAS_FLAG)

        override fun onDraw(canvas: Canvas) {
            super.onDraw(canvas)
            val w = width.toFloat()
            val h = height.toFloat()
            val (startColor, endColor) = when (divisionId) {
                "business" -> Color.rgb(18, 91, 215) to Color.rgb(6, 61, 171)
                "technology" -> Color.rgb(110, 24, 235) to Color.rgb(74, 7, 186)
                "projects" -> Color.rgb(22, 162, 85) to Color.rgb(10, 120, 60)
                "impact" -> Color.rgb(247, 107, 0) to Color.rgb(212, 79, 0)
                else -> Color.rgb(18, 91, 215) to Color.rgb(6, 61, 171)
            }
            paint.shader = LinearGradient(0f, 0f, w, h, startColor, endColor, Shader.TileMode.CLAMP)

            val cx = w / 2f
            val cy = h / 2f
            val squareSide = w * 0.70f
            val radius = squareSide * 0.28f

            canvas.save()
            canvas.rotate(45f, cx, cy)
            val rect = RectF(cx - squareSide / 2f, cy - squareSide / 2f, cx + squareSide / 2f, cy + squareSide / 2f)
            canvas.drawRoundRect(rect, radius, radius, paint)
            canvas.restore()

            paint.shader = null
        }
    }

    private fun centerSparkle() = object : View(this) {
        private val paint = Paint(Paint.ANTI_ALIAS_FLAG)
        private val starPath = Path()

        override fun onDraw(canvas: Canvas) {
            super.onDraw(canvas)
            val cx = width / 2f
            val cy = height / 2f
            val rOuter = width * 0.42f
            val rInner = width * 0.11f

            // Soft glow behind star
            paint.shader = RadialGradient(
                cx, cy, rOuter * 1.6f,
                intArrayOf(Color.argb(200, 200, 235, 255), Color.argb(80, 120, 190, 255), Color.TRANSPARENT),
                floatArrayOf(0f, 0.45f, 1f),
                Shader.TileMode.CLAMP
            )
            canvas.drawCircle(cx, cy, rOuter * 1.6f, paint)
            paint.shader = null

            // 4-point star
            starPath.reset()
            starPath.moveTo(cx, cy - rOuter)
            starPath.quadTo(cx, cy, cx + rInner, cy - rInner)
            starPath.quadTo(cx, cy, cx + rOuter, cy)
            starPath.quadTo(cx, cy, cx + rInner, cy + rInner)
            starPath.quadTo(cx, cy, cx, cy + rOuter)
            starPath.quadTo(cx, cy, cx - rInner, cy + rInner)
            starPath.quadTo(cx, cy, cx - rOuter, cy)
            starPath.quadTo(cx, cy, cx - rInner, cy - rInner)
            starPath.close()

            paint.color = Color.WHITE
            canvas.drawPath(starPath, paint)
            paint.color = Color.rgb(180, 225, 255)
            canvas.drawCircle(cx, cy, rInner * 0.7f, paint)
        }
    }

    private fun welcomeAccent() = object : View(this) {
        private val paint = Paint(Paint.ANTI_ALIAS_FLAG).apply {
            color = Color.rgb(255, 160, 0)
            style = Paint.Style.STROKE
            strokeWidth = dp(3).toFloat()
            strokeCap = Paint.Cap.ROUND
        }
        private val curve = Path()

        override fun onDraw(canvas: Canvas) {
            super.onDraw(canvas)
            val w = width.toFloat()
            val h = height.toFloat()
            curve.reset()
            curve.moveTo(w * 0.04f, h * 0.35f)
            curve.quadTo(w * 0.5f, h * 0.85f, w * 0.96f, h * 0.35f)
            canvas.drawPath(curve, paint)
        }
    }

    private fun welcomeBackdrop() = object : View(this) {
        private val paint = Paint(Paint.ANTI_ALIAS_FLAG).apply { isFilterBitmap = true }
        private val bgBitmap: Bitmap? by lazy {
            try {
                BitmapFactory.decodeResource(resources, R.drawable.background)
            } catch (e: Exception) {
                null
            }
        }

        override fun onDraw(canvas: Canvas) {
            super.onDraw(canvas)
            val w = width.toFloat()
            val h = height.toFloat()
            val bmp = bgBitmap
            if (bmp != null) {
                val srcW = bmp.width.toFloat()
                val srcH = bmp.height.toFloat()
                val scale = maxOf(w / srcW, h / srcH)
                val dx = (w - srcW * scale) / 2f
                val dy = (h - srcH * scale) / 2f
                val destRect = RectF(dx, dy, dx + srcW * scale, dy + srcH * scale)
                canvas.drawBitmap(bmp, null, destRect, paint)
            } else {
                paint.shader = LinearGradient(
                    0f, 0f, 0f, h,
                    intArrayOf(Color.rgb(218, 234, 255), Color.WHITE, Color.rgb(220, 240, 220)),
                    floatArrayOf(0f, 0.7f, 1f),
                    Shader.TileMode.CLAMP
                )
                canvas.drawRect(0f, 0f, w, h, paint)
                paint.shader = null
            }
        }
    }

    private fun homeBannerCard(): View = FrameLayout(this).apply {
        layoutParams = LinearLayout.LayoutParams(-1, dp(205)).apply {
            bottomMargin = dp(12)
        }
        background = rounded(Color.WHITE, 18)
        clipToOutline = true

        val img = ImageView(this@MainActivity).apply {
            setImageResource(R.drawable.home_skyline)
            scaleType = ImageView.ScaleType.CENTER_CROP
            contentDescription = "Together for a brighter future"
        }
        addView(img, FrameLayout.LayoutParams(-1, -1))
    }

    private fun showHome() {
        restoreBars()
        val content = pageContent()
        content.addView(homeBannerCard())
        content.addView(label("Our Divisions", 17, ink, Typeface.BOLD).apply {
            gravity = Gravity.CENTER_VERTICAL or Gravity.START
        }, LinearLayout.LayoutParams(-1, dp(40)))
        divisions.chunked(2).forEach { pair ->
            val row = LinearLayout(this).apply { orientation = LinearLayout.HORIZONTAL }
            pair.forEachIndexed { index, division ->
                row.addView(divisionCard(division), LinearLayout.LayoutParams(0, dp(180), 1f).apply {
                    if (index == 0) marginEnd = dp(4) else marginStart = dp(4)
                })
            }
            content.addView(row, LinearLayout.LayoutParams(-1, -2).apply { bottomMargin = dp(7) })
        }
        content.addView(missionCard { showAbout() }, LinearLayout.LayoutParams(-1, dp(84)).apply {
            topMargin = dp(3)
        })
        setContentView(page("Home", "home", content, homeHeader = true))
    }

    private fun showDivisions() {
        val content = pageContent()
        content.addView(label("One Family. Four Unique Identities.", 19, ink, Typeface.BOLD).apply {
            gravity = Gravity.START
            setPadding(0, dp(2), 0, dp(3))
        })
        content.addView(label("Discover the teams creating opportunity, innovation and positive impact.", 12, muted, Typeface.NORMAL).apply {
            gravity = Gravity.START
            setLineSpacing(dp(2).toFloat(), 1f)
            setPadding(0, 0, 0, dp(13))
        })
        divisions.forEach { division ->
            content.addView(divisionListCard(division), LinearLayout.LayoutParams(-1, -2).apply { bottomMargin = dp(13) })
        }
        content.addView(offlineNote())
        setContentView(page("Our Divisions", "divisions", content))
    }

    private fun showDivision(division: Division) {
        val content = pageContent()
        content.addView(photo(division.image, 196, 18).apply { contentDescription = division.title })
        content.addView(divisionIntro(division))
        when (division.id) {
            "business" -> {
                content.addView(infoPanel(R.drawable.ic_target, division.color, "Our Vision",
                    "To be a leading diversified business group in Africa."))
                content.addView(sectionHeading(division.section))
                division.features.forEach { feature ->
                    content.addView(featureRow(feature, division.color) {
                        showInterest(division, feature.title)
                    })
                }
                content.addView(primaryButton("Explore More", division.color, Color.WHITE, R.drawable.ic_arrow_right) {
                    showInterest(division, "Business enquiry")
                })
            }
            "technology" -> {
                content.addView(sectionHeading(division.section))
                division.features.forEach { feature ->
                    content.addView(featureRow(feature, division.color) { showInterest(division, feature.title) })
                }
                content.addView(primaryButton("Explore Our Tech", division.color, Color.WHITE, R.drawable.ic_arrow_right) {
                    showInterest(division, "Technology services")
                })
            }
            "projects" -> {
                content.addView(sectionHeading(division.section))
                division.features.forEach { feature ->
                    content.addView(featureRow(feature, division.color) {
                        showInterest(division, feature.title)
                    })
                }
                content.addView(primaryButton("Explore Projects", division.color, Color.WHITE, R.drawable.ic_arrow_right) {
                    showInterest(division, "Project opportunity")
                })
            }
            else -> {
                content.addView(sectionHeading(division.section))
                division.features.forEach { feature ->
                    content.addView(featureRow(feature, division.color) { showInterest(division, feature.title) })
                }
                content.addView(primaryButton("Join Our Impact", division.color, Color.WHITE, R.drawable.ic_arrow_right) {
                    showDonation()
                })
            }
        }
        content.addView(offlineNote())
        setContentView(page(division.title, "divisions", content, onBack = { showDivisions() }))
    }

    private fun showUpdates() {
        val content = pageContent()
        content.addView(label("Stories from across KILIVO LABS", 19, ink, Typeface.BOLD).apply {
            gravity = Gravity.START
            setPadding(0, dp(2), 0, dp(3))
        })
        content.addView(label("Explore technology, community and project updates saved for offline reading.",
            12, muted, Typeface.NORMAL).apply {
            gravity = Gravity.START
            setLineSpacing(dp(2).toFloat(), 1f)
            setPadding(0, 0, 0, dp(12))
        })
        val categories = listOf("All", "Technology", "Impact", "Projects")
        val filters = LinearLayout(this).apply { orientation = LinearLayout.HORIZONTAL }
        categories.forEachIndexed { index, category ->
            filters.addView(chip(category, newsFilter == category) {
                newsFilter = category
                showUpdates()
            }, LinearLayout.LayoutParams(0, dp(42), 1f).apply { if (index > 0) marginStart = dp(5) })
        }
        content.addView(filters, LinearLayout.LayoutParams(-1, -2).apply { bottomMargin = dp(8) })
        val filteredUpdates = updates.filter { newsFilter == "All" || it.category == newsFilter }
        content.addView(sectionHeading("Latest updates", "${filteredUpdates.size} saved"))
        filteredUpdates.forEach { item ->
            content.addView(newsCard(item) { showUpdateDetails(item) }, LinearLayout.LayoutParams(-1, -2).apply {
                bottomMargin = dp(10)
            })
        }
        content.addView(offlineNote())
        setContentView(page("Updates", "updates", content))
    }

    private fun showUpdateDetails(item: NewsItem) {
        val content = pageContent()
        content.addView(photo(item.image, 190, 18))
        content.addView(label(item.category.uppercase(), 12, blue, Typeface.BOLD).apply {
            gravity = Gravity.START
            setPadding(0, dp(14), 0, dp(5))
        })
        content.addView(label(item.title, 22, ink, Typeface.BOLD).apply {
            gravity = Gravity.START
            setLineSpacing(dp(2).toFloat(), 1f)
        })
        content.addView(label(item.date, 12, muted, Typeface.NORMAL).apply {
            gravity = Gravity.START
            setPadding(0, dp(9), 0, dp(16))
        })
        content.addView(body(item.description, 15))
        content.addView(infoPanel(R.drawable.ic_calendar, blue, "Offline article",
            "This update is saved in the app and can be read without internet."))
        setContentView(page("News & Updates", "updates", content, onBack = { showUpdates() }))
    }

    private fun settingsLandscapeCard(): View = FrameLayout(this).apply {
        background = rounded(Color.WHITE, 16)
        clipToOutline = true

        val img = ImageView(this@MainActivity).apply {
            setImageResource(R.drawable.settings_landscape)
            scaleType = ImageView.ScaleType.FIT_XY
        }
        addView(img, FrameLayout.LayoutParams(-1, -1))
    }

    private fun showProfile() {
        val content = pageContent().apply { setPadding(dp(15), dp(9), dp(15), 0) }
        content.addView(profileHeader())
        content.addView(profileMenu(R.drawable.ic_profile, "My Profile") { showEditProfile() })
        content.addView(profileMenu(R.drawable.ic_bell, "Notifications", badge = "3") { showNotifications() })
        content.addView(profileMenu(R.drawable.ic_gear, "App Preferences") { showPreferences() })
        content.addView(profileMenu(R.drawable.ic_target, "About KILIVO LABS") { showAbout() })
        content.addView(profileMenu(R.drawable.ic_help, "Help & Support") { showHelp() })
        content.addView(profileMenu(R.drawable.ic_shield, "Privacy & Security") { showPrivacy() })
        content.addView(profileMenu(R.drawable.ic_logout, "Logout") {
            AlertDialog.Builder(this)
                .setTitle("Leave KILIVO LABS?")
                .setMessage("Your offline profile and saved items will remain on this device.")
                .setNegativeButton("Cancel", null)
                .setPositiveButton("Logout") { _, _ ->
                    prefs.edit().putBoolean("onboarding_complete", false).apply()
                    showWelcome()
                }
                .show()
        })
        content.addView(settingsLandscapeCard(), LinearLayout.LayoutParams(-1, 0, 1f).apply {
            topMargin = dp(12)
            bottomMargin = dp(8)
        })
        setContentView(page("Profile", "profile", content, fillViewport = true))
    }

    private fun showEditProfile() {
        val content = pageContent()
        content.addView(profileHeader())
        content.addView(label("Name", 13, ink, Typeface.BOLD).apply {
            gravity = Gravity.START
            setPadding(0, dp(18), 0, dp(7))
        })
        val name = EditText(this).apply {
            setText(prefs.getString("profile_name", "Mudhihiri Selemani"))
            hint = "Your name"
            setSingleLine(true)
            setPadding(dp(14), dp(4), dp(14), dp(4))
            background = rounded(Color.WHITE, 12, stroke)
        }
        content.addView(name, LinearLayout.LayoutParams(-1, dp(52)))
        content.addView(primaryButton("Save Profile", blue, Color.WHITE, null) {
            prefs.edit().putString("profile_name", name.text.toString().trim().ifBlank { "KILIVO LABS Member" }).apply()
            showProfile()
        }, LinearLayout.LayoutParams(-1, dp(50)).apply { topMargin = dp(16) })
        setContentView(page("My Profile", "profile", content, onBack = { showProfile() }))
    }

    private fun showPreferences() {
        val content = pageContent()
        content.addView(label("Preferences are saved on this device.", 14, muted, Typeface.NORMAL).apply {
            gravity = Gravity.START
            setPadding(0, 0, 0, dp(12))
        })
        preferenceRow(content, "Keep me informed", "Show local app updates", "pref_updates", true)
        preferenceRow(content, "Remember welcome screen", "Open Home after splash on next launch", "onboarding_complete", true)
        content.addView(infoPanel(R.drawable.ic_shield, blue, "Offline mode",
            "This app does not connect to a server. Forms and pledges are saved only on this device."))
        setContentView(page("App Preferences", "profile", content, onBack = { showProfile() }))
    }

    private fun showPrivacy() {
        val content = pageContent()
        content.addView(infoPanel(R.drawable.ic_shield, blue, "Stored on this device",
            "Your profile name, preferences, interests and pledges are stored locally using Android app storage."))
        content.addView(infoPanel(R.drawable.ic_support, blue, "No network access",
            "This version works offline and does not send your information to any server."))
        content.addView(primaryButton("Clear Local App Data", Color.rgb(196, 44, 60), Color.WHITE, null) {
            AlertDialog.Builder(this).setTitle("Clear local app data?")
                .setMessage("This removes your profile name, preferences and local pledges from this device.")
                .setNegativeButton("Cancel", null)
                .setPositiveButton("Clear") { _, _ ->
                    prefs.edit().clear().apply()
                    showSplash()
                }.show()
        }, LinearLayout.LayoutParams(-1, dp(50)).apply { topMargin = dp(12) })
        setContentView(page("Privacy & Security", "profile", content, onBack = { showProfile() }))
    }

    private fun showNotifications() {
        val content = pageContent()
        content.addView(infoPanel(R.drawable.ic_bell, blue, "You're all caught up",
            "This offline version has no new notifications. Saved updates are available in the Updates tab."))
        updates.take(3).forEach { item -> content.addView(newsCard(item) { showUpdateDetails(item) }) }
        setContentView(page("Notifications", "profile", content, onBack = { showProfile() }))
    }

    private fun showHelp() {
        val content = pageContent()
        listOf(
            "What can I do in this offline version?" to "Browse KILIVO LABS divisions and saved updates, edit your local profile, and save offline project interests or donation pledges.",
            "Are donations processed?" to "No. This version only saves a local pledge on this device. It does not collect payment details or process a payment.",
            "Will my information sync?" to "No. The app is offline and does not send data to a server."
        ).forEach { (question, answer) -> content.addView(infoPanel(R.drawable.ic_help, blue, question, answer)) }
        setContentView(page("Help & Support", "profile", content, onBack = { showProfile() }))
    }

    private fun showAbout() {
        val content = pageContent()
        content.addView(photo(R.drawable.home_skyline, 145, 18))
        content.addView(label("KILIVO LABS", 25, navy, Typeface.BOLD).apply {
            gravity = Gravity.START
            setPadding(0, dp(16), 0, dp(4))
        })
        content.addView(body("One family. Four unique identities. A diversified enterprise group driving innovation, opportunity and social impact.", 15))
        content.addView(infoPanel(R.drawable.ic_target, blue, "Our Mission",
            "Create opportunities, build solutions and make positive impact."))
        divisions.forEach { division ->
            content.addView(featureRow(Feature(division.icon, division.title, division.subtitle), division.color) {
                showDivision(division)
            })
        }
        setContentView(page("About KILIVO LABS", "profile", content, onBack = { showProfile() }))
    }

    private fun showDonation() {
        val content = pageContent()
        val banner = LinearLayout(this).apply {
            orientation = LinearLayout.HORIZONTAL
            gravity = Gravity.CENTER_VERTICAL
            background = rounded(Color.rgb(255, 239, 222), 18)
            setPadding(dp(14), dp(14), dp(14), dp(14))
        }
        banner.addView(icon(R.drawable.ic_impact, Color.rgb(239, 103, 0), 42), LinearLayout.LayoutParams(dp(56), dp(56)))
        banner.addView(label("Your Support Changes Lives\nChoose an amount to save a pledge offline.",
            14, ink, Typeface.BOLD).apply { gravity = Gravity.START; setPadding(dp(7), 0, 0, 0) })
        content.addView(banner)
        content.addView(sectionHeading("Choose Amount"))
        listOf("TZS 5,000", "TZS 10,000", "TZS 20,000", "Other Amount").chunked(2).forEach { pair ->
            val row = LinearLayout(this).apply { orientation = LinearLayout.HORIZONTAL }
            pair.forEachIndexed { index, amount ->
                row.addView(chip(amount, donationAmount == amount) {
                    if (amount == "Other Amount") {
                        val input = EditText(this).apply {
                            hint = "Amount in TZS"
                            inputType = InputType.TYPE_CLASS_NUMBER
                        }
                        AlertDialog.Builder(this).setTitle("Other donation amount").setView(input)
                            .setNegativeButton("Cancel", null)
                            .setPositiveButton("Use amount") { _, _ ->
                                input.text.toString().trim().toLongOrNull()?.let { donationAmount = "TZS ${"%,d".format(it)}" }
                                showDonation()
                            }.show()
                    } else {
                        donationAmount = amount
                        showDonation()
                    }
                }, LinearLayout.LayoutParams(0, dp(46), 1f).apply {
                    if (index == 0) marginEnd = dp(5) else marginStart = dp(5)
                })
            }
            content.addView(row, LinearLayout.LayoutParams(-1, -2).apply { bottomMargin = dp(8) })
        }
        content.addView(sectionHeading("How it works offline"))
        content.addView(infoPanel(R.drawable.ic_shield, blue, "Pledge only",
            "Saving this pledge does not process a payment. Payment instructions can be added when online services are available."))
        content.addView(primaryButton("Save Pledge Offline", Color.rgb(244, 171, 0), ink, null) {
            val items = prefs.getStringSet("pledges", emptySet()).orEmpty().toMutableSet()
            items.add("${System.currentTimeMillis()}|$donationAmount|Pending offline pledge")
            prefs.edit().putStringSet("pledges", items).apply()
            showPledgeSaved()
        })
        setContentView(page("Join Our Impact", "divisions", content, onBack = { showDivision(divisions.last()) }))
    }

    private fun showPledgeSaved() {
        val content = pageContent()
        content.addView(icon(R.drawable.ic_impact, Color.rgb(239, 103, 0), 54),
            LinearLayout.LayoutParams(dp(72), dp(72)).apply { gravity = Gravity.CENTER_HORIZONTAL })
        content.addView(label("Thank you for your support", 22, ink, Typeface.BOLD).apply {
            gravity = Gravity.CENTER
            setPadding(0, dp(14), 0, dp(8))
        })
        content.addView(body("Your $donationAmount pledge is saved on this device. No payment has been made.", 15).apply {
            gravity = Gravity.CENTER
            setPadding(dp(8), 0, dp(8), dp(18))
        })
        content.addView(primaryButton("View My Pledges", blue, Color.WHITE, null) { showPledges() })
        setContentView(page("Pledge Saved", "divisions", content, onBack = { showDonation() }))
    }

    private fun showPledges() {
        val content = pageContent()
        val saved = prefs.getStringSet("pledges", emptySet()).orEmpty().sortedDescending()
        if (saved.isEmpty()) {
            content.addView(infoPanel(R.drawable.ic_heart, blue, "No pledges saved",
                "Your offline donation pledges will appear here."))
        } else saved.forEach { pledge ->
            val parts = pledge.split("|", limit = 3)
            val item = LinearLayout(this).apply {
                orientation = LinearLayout.VERTICAL
                background = rounded(Color.WHITE, 15, stroke)
                setPadding(dp(14), dp(12), dp(14), dp(12))
            }
            item.addView(label(parts.getOrElse(1) { "Donation pledge" }, 16, ink, Typeface.BOLD).apply { gravity = Gravity.START })
            item.addView(label(parts.getOrElse(2) { "Pending offline pledge" }, 12, muted, Typeface.NORMAL).apply {
                gravity = Gravity.START
                setPadding(0, dp(4), 0, 0)
            })
            content.addView(item, LinearLayout.LayoutParams(-1, -2).apply { bottomMargin = dp(8) })
        }
        setContentView(page("My Offline Pledges", "profile", content, onBack = { showProfile() }))
    }

    private fun showOfflineInterests() {
        val content = pageContent()
        val interests = prefs.getStringSet("interests", emptySet()).orEmpty().sortedDescending()
        if (interests.isEmpty()) {
            content.addView(infoPanel(R.drawable.ic_projects, blue, "No project interests saved",
                "When you select a division or service and save an interest, it will appear here."))
        } else {
            interests.forEach { saved ->
                val parts = saved.split("|", limit = 5)
                val row = LinearLayout(this).apply {
                    orientation = LinearLayout.VERTICAL
                    background = rounded(Color.WHITE, 14, stroke)
                    setPadding(dp(13), dp(11), dp(13), dp(11))
                }
                row.addView(label(parts.getOrElse(2) { "Saved interest" }, 13, ink, Typeface.BOLD).apply {
                    gravity = Gravity.START
                })
                row.addView(label(parts.getOrElse(1) { "KILIVO LABS" }, 10, blue, Typeface.BOLD).apply {
                    gravity = Gravity.START
                    setPadding(0, dp(3), 0, 0)
                })
                row.addView(label("Saved on this device · not yet sent", 10, muted, Typeface.NORMAL).apply {
                    gravity = Gravity.START
                    setPadding(0, dp(5), 0, 0)
                })
                content.addView(row, LinearLayout.LayoutParams(-1, -2).apply { bottomMargin = dp(8) })
            }
        }
        setContentView(page("My Projects", "profile", content, onBack = { showProfile() }))
    }

    private fun showInterest(division: Division, interest: String) {
        val form = LinearLayout(this).apply {
            orientation = LinearLayout.VERTICAL
            setPadding(dp(4), dp(5), dp(4), 0)
        }
        val name = EditText(this).apply {
            hint = "Your name"
            setText(prefs.getString("profile_name", ""))
            setSingleLine(true)
        }
        val contact = EditText(this).apply { hint = "Phone or email (optional)" }
        form.addView(name)
        form.addView(contact)
        AlertDialog.Builder(this).setTitle("Save interest offline")
            .setMessage("$interest · ${division.title}\nThis request stays on this device.")
            .setView(form).setNegativeButton("Cancel", null)
            .setPositiveButton("Save") { _, _ ->
                val items = prefs.getStringSet("interests", emptySet()).orEmpty().toMutableSet()
                items.add("${System.currentTimeMillis()}|${division.title}|$interest|${name.text.toString().trim()}|${contact.text.toString().trim()}")
                prefs.edit().putStringSet("interests", items)
                    .putString("profile_name", name.text.toString().trim().ifBlank {
                        prefs.getString("profile_name", "KILIVO LABS Member")
                    }).apply()
                AlertDialog.Builder(this).setTitle("Saved on this device")
                    .setMessage("Your interest is stored locally. It has not been sent to KILIVO LABS.")
                    .setPositiveButton("OK", null).show()
            }.show()
    }

    private fun showSearch() {
        val searchItems = buildList {
            divisions.forEach { division ->
                add(SearchResult(
                    division.title,
                    division.subtitle,
                    "${division.title} ${division.shortTitle} ${division.subtitle} ${division.description}",
                    { showDivision(division) }
                ))
                division.features.forEach { feature ->
                    add(SearchResult(
                        feature.title,
                        "${division.shortTitle} · ${feature.subtitle}",
                        "${feature.title} ${feature.subtitle} ${division.title} ${division.shortTitle}",
                        { showDivision(division) }
                    ))
                }
            }
            updates.forEach { update ->
                add(SearchResult(
                    update.title,
                    "Update · ${update.category} · ${update.date}",
                    "${update.title} ${update.category} ${update.description}",
                    { showUpdateDetails(update) }
                ))
            }
        }

        val content = pageContent()
        content.addView(label("Find what you need", 20, ink, Typeface.BOLD).apply {
            gravity = Gravity.START
            setPadding(0, dp(2), 0, dp(4))
        })
        content.addView(label("Search divisions, services and saved updates.", 12, muted, Typeface.NORMAL).apply {
            gravity = Gravity.START
            setPadding(0, 0, 0, dp(12))
        })
        val searchBox = LinearLayout(this).apply {
            orientation = LinearLayout.HORIZONTAL
            gravity = Gravity.CENTER_VERTICAL
            background = rounded(Color.WHITE, 14, stroke)
            elevation = dp(2).toFloat()
            setPadding(dp(13), 0, dp(13), 0)
        }
        searchBox.addView(icon(R.drawable.ic_search, blue, 21))
        val input = EditText(this).apply {
            hint = "Search divisions, services, updates..."
            isSingleLine = true
            inputType = InputType.TYPE_CLASS_TEXT or InputType.TYPE_TEXT_FLAG_CAP_SENTENCES
            imeOptions = android.view.inputmethod.EditorInfo.IME_ACTION_SEARCH
            background = null
            setPadding(dp(10), dp(10), 0, dp(10))
        }
        searchBox.addView(input, LinearLayout.LayoutParams(0, dp(52), 1f))
        content.addView(searchBox, LinearLayout.LayoutParams(-1, dp(54)))

        val resultHeading = label("Start typing to search", 13, muted, Typeface.BOLD).apply {
            gravity = Gravity.START
            setPadding(0, dp(16), 0, dp(8))
        }
        content.addView(resultHeading)
        val results = LinearLayout(this).apply {
            orientation = LinearLayout.VERTICAL
        }
        content.addView(results)
        fun renderResults(rawQuery: String) {
            val query = rawQuery.trim()
            results.removeAllViews()
            if (query.isBlank()) {
                resultHeading.text = "Start typing to search"
                results.addView(searchEmptyState(
                    "Search by division name, service, project or update."
                ))
                return
            }

            val matches = searchItems.filter { it.searchableText.contains(query, ignoreCase = true) }
            if (matches.isEmpty()) {
                resultHeading.text = "No results"
                results.addView(searchEmptyState("No saved offline results for \"$query\"."))
                return
            }

            resultHeading.text = "${matches.size} result${if (matches.size == 1) "" else "s"}"
            matches.take(25).forEach { result ->
                val row = LinearLayout(this).apply {
                    orientation = LinearLayout.HORIZONTAL
                    gravity = Gravity.CENTER_VERTICAL
                    background = rounded(Color.WHITE, 12, stroke)
                    setPadding(dp(12), dp(10), dp(10), dp(10))
                    isClickable = true
                    isFocusable = true
                    setOnClickListener {
                        input.clearFocus()
                        result.onClick()
                    }
                }
                val copy = LinearLayout(this).apply { orientation = LinearLayout.VERTICAL }
                copy.addView(label(result.title, 14, ink, Typeface.BOLD).apply { gravity = Gravity.START })
                copy.addView(label(result.subtitle, 11, muted, Typeface.NORMAL).apply {
                    gravity = Gravity.START
                    setPadding(0, dp(3), 0, 0)
                })
                row.addView(copy, LinearLayout.LayoutParams(0, -2, 1f))
                row.addView(icon(R.drawable.ic_arrow_right, blue, 18))
                results.addView(row, LinearLayout.LayoutParams(-1, -2).apply { bottomMargin = dp(7) })
            }
        }

        input.addTextChangedListener(object : TextWatcher {
            override fun beforeTextChanged(s: CharSequence?, start: Int, count: Int, after: Int) = Unit
            override fun onTextChanged(s: CharSequence?, start: Int, before: Int, count: Int) {
                renderResults(s?.toString().orEmpty())
            }
            override fun afterTextChanged(s: Editable?) = Unit
        })
        renderResults("")
        setContentView(page("Search", "search", content))
    }

    private fun searchEmptyState(message: String): View =
        label(message, 13, muted, Typeface.NORMAL).apply {
            gravity = Gravity.START
            background = rounded(Color.WHITE, 12, stroke)
            setPadding(dp(14), dp(14), dp(14), dp(14))
        }

    private fun page(
        title: String,
        active: String?,
        content: LinearLayout,
        homeHeader: Boolean = false,
        onBack: (() -> Unit)? = null,
        fillViewport: Boolean = false
    ): View {
        val root = LinearLayout(this).apply { orientation = LinearLayout.VERTICAL; setBackgroundColor(pageBg) }
        root.addView(if (homeHeader) homeToolbar() else standardToolbar(title, onBack), LinearLayout.LayoutParams(-1, dp(60)))
        val scroll = ScrollView(this).apply {
            clipToPadding = false
            isFillViewport = fillViewport
            addView(content)
        }
        root.addView(scroll, LinearLayout.LayoutParams(-1, 0, 1f))
        if (active != null) root.addView(bottomNavigation(active), LinearLayout.LayoutParams(-1, dp(60)))
        return root
    }

    private fun pageContent() = LinearLayout(this).apply {
        orientation = LinearLayout.VERTICAL
        setPadding(dp(15), dp(9), dp(15), dp(16))
    }

    private fun homeToolbar(): View {
        val bar = LinearLayout(this).apply {
            orientation = LinearLayout.HORIZONTAL
            gravity = Gravity.CENTER_VERTICAL
            setBackgroundColor(navy)
            setPadding(dp(10), 0, dp(10), 0)
        }
        bar.addView(iconButton(R.drawable.ic_menu, Color.WHITE, 26) { showHomeDrawer() },
            LinearLayout.LayoutParams(dp(40), dp(48)))
        val brand = LinearLayout(this).apply { orientation = LinearLayout.VERTICAL; gravity = Gravity.CENTER }
        brand.addView(label("KILIVO LABS", 16, Color.WHITE, Typeface.BOLD))
        brand.addView(label("Our Family. Your Partner.", 10, Color.WHITE, Typeface.NORMAL))
        bar.addView(brand, LinearLayout.LayoutParams(0, -1, 1f))
        bar.addView(notificationButton())
        return bar
    }

    private fun showHomeDrawer() {
        val drawer = Dialog(this)
        val panel = LinearLayout(this).apply {
            orientation = LinearLayout.VERTICAL
            setBackgroundColor(pageBg)
        }
        val brand = LinearLayout(this).apply {
            orientation = LinearLayout.VERTICAL
            gravity = Gravity.CENTER_VERTICAL
            setPadding(dp(22), dp(28), dp(18), dp(24))
            background = GradientDrawable(
                GradientDrawable.Orientation.TOP_BOTTOM,
                intArrayOf(navy, Color.rgb(19, 93, 210))
            )
        }
        brand.addView(label("KILIVO LABS", 22, Color.WHITE, Typeface.BOLD).apply { gravity = Gravity.START })
        brand.addView(label("Our Family. Your Partner.", 12, Color.WHITE, Typeface.NORMAL).apply {
            gravity = Gravity.START
            setPadding(0, dp(4), 0, 0)
        })
        panel.addView(brand, LinearLayout.LayoutParams(-1, dp(125)))

        listOf(
            Triple(R.drawable.ic_home, "Home", 0),
            Triple(R.drawable.ic_divisions, "Our Divisions", 1),
            Triple(R.drawable.ic_updates, "News & Updates", 2),
            Triple(R.drawable.ic_profile, "Profile", 3)
        ).forEach { (iconId, title, route) ->
            val row = LinearLayout(this).apply {
                orientation = LinearLayout.HORIZONTAL
                gravity = Gravity.CENTER_VERTICAL
                setPadding(dp(18), 0, dp(14), 0)
                isClickable = true
                isFocusable = true
                setOnClickListener {
                    drawer.dismiss()
                    when (route) {
                        0 -> showHome()
                        1 -> showDivisions()
                        2 -> showUpdates()
                        else -> showProfile()
                    }
                }
            }
            row.addView(icon(iconId, blue, 22), LinearLayout.LayoutParams(dp(34), dp(34)))
            row.addView(label(title, 14, ink, Typeface.BOLD).apply {
                gravity = Gravity.CENTER_VERTICAL or Gravity.START
            }, LinearLayout.LayoutParams(0, -1, 1f).apply { marginStart = dp(12) })
            row.addView(icon(R.drawable.ic_arrow_right, muted, 18))
            panel.addView(row, LinearLayout.LayoutParams(-1, dp(56)))
            panel.addView(View(this).apply { setBackgroundColor(stroke) },
                LinearLayout.LayoutParams(-1, dp(1)).apply { marginStart = dp(18); marginEnd = dp(18) })
        }
        panel.addView(offlineNote())

        drawer.setContentView(panel)
        drawer.window?.apply {
            setBackgroundDrawableResource(android.R.color.transparent)
            setLayout(dp(300), WindowManager.LayoutParams.MATCH_PARENT)
            setGravity(Gravity.START)
            addFlags(WindowManager.LayoutParams.FLAG_DIM_BEHIND)
            attributes = attributes.apply { dimAmount = 0.35f }
        }
        drawer.show()
        drawer.window?.setLayout(dp(300), WindowManager.LayoutParams.MATCH_PARENT)
    }

    private fun standardToolbar(title: String, onBack: (() -> Unit)?): View {
        val bar = LinearLayout(this).apply {
            orientation = LinearLayout.HORIZONTAL
            gravity = Gravity.CENTER_VERTICAL
            setBackgroundColor(headerColor(title))
            setPadding(dp(10), 0, dp(12), 0)
        }
        val leftIcon = when (title) {
            "Settings" -> R.drawable.ic_gear
            "Profile" -> R.drawable.ic_profile
            else -> R.drawable.ic_back
        }
        bar.addView(iconButton(leftIcon, Color.WHITE, 24) { onBack?.invoke() ?: showHome() },
            LinearLayout.LayoutParams(dp(42), dp(48)))
        bar.addView(label(title, 16, Color.WHITE, Typeface.BOLD).apply {
            gravity = Gravity.CENTER_VERTICAL or Gravity.START
            maxLines = 1
        }, LinearLayout.LayoutParams(0, -1, 1f))
        return bar
    }

    private fun headerColor(title: String): Int = when {
        title.contains("TECH", true) -> Color.rgb(13, 61, 190)
        title.contains("PROJECT", true) -> Color.rgb(0, 126, 105)
        title.contains("IMPACT", true) || title.contains("CHARITY", true) -> Color.rgb(207, 77, 0)
        else -> navy
    }

    private fun bottomNavigation(active: String): View {
        val nav = LinearLayout(this).apply {
            orientation = LinearLayout.HORIZONTAL
            gravity = Gravity.CENTER_VERTICAL
            background = GradientDrawable().apply { setColor(Color.WHITE); setStroke(dp(1), stroke) }
        }
        listOf(
            Triple(R.drawable.ic_home, "Home", "home"),
            Triple(R.drawable.ic_divisions, "Divisions", "divisions"),
            Triple(R.drawable.ic_search, "Search", "search"),
            Triple(R.drawable.ic_updates, "Updates", "updates"),
            Triple(R.drawable.ic_profile, "Profile", "profile")
        ).forEach { (res, title, route) ->
            val selected = route == active
            val tint = if (selected) blue else Color.rgb(87, 105, 145)
            val item = LinearLayout(this).apply {
                orientation = LinearLayout.VERTICAL
                gravity = Gravity.CENTER
                isClickable = true
                isFocusable = true
                contentDescription = title
                setOnClickListener {
                    when (route) {
                        "home" -> showHome()
                        "divisions" -> showDivisions()
                        "search" -> showSearch()
                        "updates" -> showUpdates()
                        else -> showProfile()
                    }
                }
            }

            if (route == "updates") {
                val iconBox = FrameLayout(this).apply {
                    addView(icon(res, tint, 21), FrameLayout.LayoutParams(dp(22), dp(22), Gravity.CENTER))
                    addView(label("5", 8, Color.WHITE, Typeface.BOLD).apply {
                        background = rounded(Color.rgb(232, 34, 49), 50)
                        gravity = Gravity.CENTER
                    }, FrameLayout.LayoutParams(dp(14), dp(14), Gravity.TOP or Gravity.RIGHT).apply {
                        topMargin = -dp(2)
                        rightMargin = -dp(2)
                    })
                }
                item.addView(iconBox)
            } else {
                item.addView(icon(res, tint, 21))
            }

            item.addView(label(title, 11, tint, if (selected) Typeface.BOLD else Typeface.NORMAL).apply {
                setPadding(0, dp(2), 0, 0)
            })
            nav.addView(item, LinearLayout.LayoutParams(0, -1, 1f))
        }
        return nav
    }

    private fun divisionCard(d: Division): View {
        val container = FrameLayout(this).apply {
            val border = Color.argb(105, Color.red(d.color), Color.green(d.color), Color.blue(d.color))
            background = rounded(d.pale, 16, border)
            elevation = dp(5).toFloat()
            translationZ = dp(1).toFloat()
            isClickable = true
            isFocusable = true
            setOnClickListener { showDivision(d) }
        }

        val content = LinearLayout(this).apply {
            orientation = LinearLayout.VERTICAL
            gravity = Gravity.CENTER
            setPadding(dp(14), dp(14), dp(14), dp(14))
        }

        val cardIcon = when (d.id) {
            "technology" -> R.drawable.ic_code
            "projects" -> R.drawable.ic_welcome_hardhat
            "impact" -> R.drawable.ic_welcome_impact
            else -> d.icon
        }

        content.addView(icon(cardIcon, d.color, 39))
        content.addView(label("KILIVO", 13, ink, Typeface.BOLD).apply {
            setPadding(0, dp(5), 0, 0)
        })
        content.addView(label(d.shortTitle.uppercase(), 16, ink, Typeface.BOLD))
        content.addView(label(d.subtitle, 12, Color.rgb(32, 49, 88), Typeface.NORMAL).apply {
            maxLines = 1
            setPadding(0, dp(2), 0, 0)
        })

        container.addView(content, FrameLayout.LayoutParams(-1, -1, Gravity.CENTER))

        val circleBtn = FrameLayout(this).apply {
            background = rounded(d.color, 50)
            addView(icon(R.drawable.ic_arrow_right, Color.WHITE, 12),
                FrameLayout.LayoutParams(dp(12), dp(12), Gravity.CENTER))
        }

        container.addView(circleBtn, FrameLayout.LayoutParams(dp(22), dp(22), Gravity.BOTTOM or Gravity.RIGHT).apply {
            rightMargin = dp(8)
            bottomMargin = dp(8)
        })

        return container
    }

    private fun divisionListCard(d: Division): View {
        val card = LinearLayout(this).apply {
            orientation = LinearLayout.HORIZONTAL
            gravity = Gravity.CENTER_VERTICAL
            val border = Color.argb(105, Color.red(d.color), Color.green(d.color), Color.blue(d.color))
            background = rounded(d.pale, 17, border)
            elevation = dp(4).toFloat()
            translationZ = dp(1).toFloat()
            setPadding(dp(15), dp(16), dp(14), dp(16))
            isClickable = true
            isFocusable = true
            setOnClickListener { showDivision(d) }
        }
        val cardIcon = when (d.id) {
            "technology" -> R.drawable.ic_code
            "projects" -> R.drawable.ic_welcome_hardhat
            "impact" -> R.drawable.ic_welcome_impact
            else -> d.icon
        }
        card.addView(iconBadge(cardIcon, d.color, Color.WHITE, 60))
        val copy = LinearLayout(this).apply { orientation = LinearLayout.VERTICAL }
        copy.addView(label(d.title, 16, ink, Typeface.BOLD).apply { gravity = Gravity.START })
        copy.addView(label(d.subtitle, 12, d.color, Typeface.BOLD).apply {
            gravity = Gravity.START
            setPadding(0, dp(2), 0, 0)
        })
        copy.addView(label(d.description, 12, Color.rgb(40, 60, 100), Typeface.NORMAL).apply {
            gravity = Gravity.START
            maxLines = 2
            setLineSpacing(dp(1).toFloat(), 1f)
            setPadding(0, dp(4), 0, 0)
        })
        card.addView(copy, LinearLayout.LayoutParams(0, -2, 1f).apply {
            marginStart = dp(12)
            marginEnd = dp(8)
        })
        val arrow = FrameLayout(this).apply {
            background = rounded(d.color, 50)
            addView(icon(R.drawable.ic_arrow_right, Color.WHITE, 17),
                FrameLayout.LayoutParams(dp(20), dp(20), Gravity.CENTER))
        }
        card.addView(arrow, LinearLayout.LayoutParams(dp(38), dp(38)))
        return card
    }

    private fun divisionIntro(d: Division): View {
        val card = LinearLayout(this).apply {
            orientation = LinearLayout.HORIZONTAL
            gravity = Gravity.CENTER_VERTICAL
            val border = Color.argb(105, Color.red(d.color), Color.green(d.color), Color.blue(d.color))
            background = rounded(Color.WHITE, 19, border)
            elevation = dp(4).toFloat()
            translationZ = dp(1).toFloat()
            setPadding(dp(14), dp(14), dp(14), dp(14))
        }
        card.addView(iconBadge(d.icon, d.color, d.pale, 60))
        val copy = LinearLayout(this).apply { orientation = LinearLayout.VERTICAL }
        copy.addView(label(d.title, 16, ink, Typeface.BOLD).apply { gravity = Gravity.START })
        copy.addView(label(d.subtitle, 13, d.color, Typeface.BOLD).apply {
            gravity = Gravity.START
            setPadding(0, dp(3), 0, dp(4))
        })
        copy.addView(label(d.description, 12, ink, Typeface.NORMAL).apply {
            gravity = Gravity.START
            maxLines = 3
            setLineSpacing(dp(1).toFloat(), 1f)
        })
        card.addView(copy, LinearLayout.LayoutParams(0, -2, 1f).apply { marginStart = dp(11) })
        return card.apply {
            layoutParams = LinearLayout.LayoutParams(-1, -2).apply {
                setMargins(dp(10), -dp(17), dp(10), dp(9))
            }
        }
    }

    private fun areaTile(feature: Feature, division: Division): View {
        val tile = LinearLayout(this).apply {
            orientation = LinearLayout.VERTICAL
            gravity = Gravity.CENTER
            background = rounded(Color.WHITE, 14, stroke)
            setPadding(dp(4), dp(9), dp(4), dp(8))
            isClickable = true
            isFocusable = true
            setOnClickListener { showInterest(division, feature.title) }
        }
        tile.addView(icon(feature.icon, division.color, 24))
        tile.addView(label(feature.title, 11, ink, Typeface.BOLD).apply {
            maxLines = 2
            setPadding(0, dp(5), 0, 0)
        })
        return tile
    }

    private fun missionCard(onClick: () -> Unit): View {
        val card = LinearLayout(this).apply {
            orientation = LinearLayout.HORIZONTAL
            gravity = Gravity.CENTER_VERTICAL
            background = rounded(Color.rgb(207, 224, 255), 16, Color.rgb(171, 199, 247))
            setPadding(dp(12), dp(12), dp(12), dp(12))
            isClickable = true
            setOnClickListener { onClick() }
        }

        val iconBadge = FrameLayout(this).apply {
            background = rounded(Color.WHITE, 50)
            addView(icon(R.drawable.ic_target, Color.rgb(13, 82, 206), 27),
                FrameLayout.LayoutParams(dp(24), dp(24), Gravity.CENTER))
        }
        card.addView(iconBadge, LinearLayout.LayoutParams(dp(46), dp(46)))

        val text = LinearLayout(this).apply { orientation = LinearLayout.VERTICAL }
        text.addView(label("Our Mission", 16, Color.rgb(10, 27, 60), Typeface.BOLD).apply {
            gravity = Gravity.START
        })
        text.addView(label("Create opportunities, build solutions and make positive impact.", 12, Color.rgb(28, 46, 85), Typeface.NORMAL).apply {
            gravity = Gravity.START
            maxLines = 2
            setPadding(0, dp(2), 0, 0)
        })
        card.addView(text, LinearLayout.LayoutParams(0, -2, 1f).apply {
            marginStart = dp(9)
            marginEnd = dp(6)
        })

        card.addView(primaryButton("Learn More", Color.rgb(13, 82, 206), Color.WHITE, null) { onClick() },
            LinearLayout.LayoutParams(-2, dp(38)))

        return card
    }

    private fun infoPanel(iconId: Int, tint: Int, title: String, desc: String): View {
        val row = LinearLayout(this).apply {
            orientation = LinearLayout.HORIZONTAL
            gravity = Gravity.CENTER_VERTICAL
            background = rounded(Color.rgb(229, 239, 255), 15)
            setPadding(dp(10), dp(9), dp(10), dp(9))
        }
        row.addView(icon(iconId, tint, 28), LinearLayout.LayoutParams(dp(42), dp(42)))
        val text = LinearLayout(this).apply { orientation = LinearLayout.VERTICAL }
        text.addView(label(title, 14, ink, Typeface.BOLD).apply { gravity = Gravity.START })
        text.addView(label(desc, 12, ink, Typeface.NORMAL).apply {
            gravity = Gravity.START; maxLines = 3; setPadding(0, dp(3), 0, 0)
        })
        row.addView(text, LinearLayout.LayoutParams(0, -2, 1f).apply { marginStart = dp(10) })
        return row.apply { layoutParams = LinearLayout.LayoutParams(-1, -2).also { it.bottomMargin = dp(8) } }
    }

    private fun featureRow(feature: Feature, tint: Int, onClick: () -> Unit): View {
        val row = LinearLayout(this).apply {
            orientation = LinearLayout.HORIZONTAL
            gravity = Gravity.CENTER_VERTICAL
            background = rounded(Color.WHITE, 14, stroke)
            setPadding(dp(9), dp(7), dp(9), dp(7))
            isClickable = true
            setOnClickListener { onClick() }
        }
        row.addView(iconBadge(feature.icon, tint, Color.rgb(239, 244, 255), 48))
        val copy = LinearLayout(this).apply { orientation = LinearLayout.VERTICAL }
        copy.addView(label(feature.title, 14, ink, Typeface.BOLD).apply { gravity = Gravity.START })
        copy.addView(label(feature.subtitle, 12, muted, Typeface.NORMAL).apply {
            gravity = Gravity.START
            maxLines = 2
            setPadding(0, dp(2), 0, 0)
        })
        row.addView(copy, LinearLayout.LayoutParams(0, -2, 1f).apply { marginStart = dp(10) })
        row.addView(icon(R.drawable.ic_arrow_right, tint, 18))
        return row.apply { layoutParams = LinearLayout.LayoutParams(-1, -2).also { it.bottomMargin = dp(8) } }
    }

    private fun checkRow(feature: Feature): View {
        val row = LinearLayout(this).apply {
            orientation = LinearLayout.HORIZONTAL
            gravity = Gravity.CENTER_VERTICAL
            setPadding(dp(4), dp(6), dp(4), dp(6))
        }
        row.addView(icon(feature.icon, Color.rgb(0, 137, 111), 21), LinearLayout.LayoutParams(dp(34), dp(30)))
        val copy = LinearLayout(this).apply { orientation = LinearLayout.VERTICAL }
        copy.addView(label(feature.title, 12, ink, Typeface.BOLD).apply { gravity = Gravity.START })
        copy.addView(label(feature.subtitle, 10, muted, Typeface.NORMAL).apply { gravity = Gravity.START; setPadding(0, dp(2), 0, 0) })
        row.addView(copy)
        return row
    }

    private fun newsCard(item: NewsItem, onClick: () -> Unit): View {
        val categoryColor = when (item.category) {
            "Technology" -> Color.rgb(85, 27, 207)
            "Impact" -> Color.rgb(220, 91, 0)
            "Projects" -> Color.rgb(0, 137, 111)
            else -> blue
        }
        val categoryTint = Color.argb(
            28,
            Color.red(categoryColor),
            Color.green(categoryColor),
            Color.blue(categoryColor)
        )
        val row = LinearLayout(this).apply {
            orientation = LinearLayout.HORIZONTAL
            gravity = Gravity.CENTER_VERTICAL
            background = rounded(Color.WHITE, 16, Color.rgb(
                (Color.red(categoryColor) + 255) / 2,
                (Color.green(categoryColor) + 255) / 2,
                (Color.blue(categoryColor) + 255) / 2
            ))
            elevation = dp(3).toFloat()
            setPadding(dp(9), dp(9), dp(12), dp(9))
            isClickable = true
            isFocusable = true
            setOnClickListener { onClick() }
        }
        row.addView(photo(item.image, 94, 12), LinearLayout.LayoutParams(dp(96), dp(94)))
        val text = LinearLayout(this).apply { orientation = LinearLayout.VERTICAL }
        text.addView(label(item.category.uppercase(), 9, categoryColor, Typeface.BOLD).apply {
            gravity = Gravity.START
            background = rounded(categoryTint, 50)
            setPadding(dp(7), dp(3), dp(7), dp(3))
        })
        text.addView(label(item.title, 14, ink, Typeface.BOLD).apply {
            gravity = Gravity.START
            maxLines = 2
            setLineSpacing(dp(1).toFloat(), 1f)
            setPadding(0, dp(5), 0, 0)
        })
        text.addView(label(item.date, 11, muted, Typeface.NORMAL).apply {
            gravity = Gravity.START
            setPadding(0, dp(4), 0, 0)
        })
        text.addView(label(item.description, 11, Color.rgb(66, 83, 121), Typeface.NORMAL).apply {
            gravity = Gravity.START
            maxLines = 2
            setLineSpacing(dp(1).toFloat(), 1f)
            setPadding(0, dp(4), 0, 0)
        })
        row.addView(text, LinearLayout.LayoutParams(0, -2, 1f).apply { marginStart = dp(11) })
        val arrow = FrameLayout(this).apply {
            background = rounded(categoryColor, 50)
            addView(icon(R.drawable.ic_arrow_right, Color.WHITE, 16),
                FrameLayout.LayoutParams(dp(20), dp(20), Gravity.CENTER))
        }
        row.addView(arrow, LinearLayout.LayoutParams(dp(32), dp(32)).apply { marginStart = dp(5) })
        return row
    }

    private fun profileHeader(): View {
        val row = LinearLayout(this).apply {
            orientation = LinearLayout.HORIZONTAL
            gravity = Gravity.CENTER_VERTICAL
            background = rounded(Color.WHITE, 16, stroke)
            setPadding(dp(12), dp(12), dp(12), dp(12))
            isClickable = true
            setOnClickListener { showEditProfile() }
        }
        row.addView(iconBadge(R.drawable.ic_profile, blue, Color.rgb(231, 238, 251), 54))
        val copy = LinearLayout(this).apply { orientation = LinearLayout.VERTICAL }
        copy.addView(label(prefs.getString("profile_name", "Mudhhiri Selemani") ?: "Mudhhiri Selemani",
            18, Color.rgb(10, 27, 60), Typeface.BOLD).apply { gravity = Gravity.START })
        copy.addView(label("KILIVO LABS Member", 13, muted, Typeface.NORMAL).apply {
            gravity = Gravity.START; setPadding(0, dp(3), 0, 0)
        })
        row.addView(copy, LinearLayout.LayoutParams(0, -2, 1f).apply { marginStart = dp(12) })
        row.addView(icon(R.drawable.ic_arrow_right, blue, 18))
        return row.apply { layoutParams = LinearLayout.LayoutParams(-1, -2).also { it.bottomMargin = dp(12) } }
    }

    private fun profileMenu(iconId: Int, title: String, subtitle: String? = null, badge: String? = null, onClick: () -> Unit): View {
        val row = LinearLayout(this).apply {
            orientation = LinearLayout.HORIZONTAL
            gravity = Gravity.CENTER_VERTICAL
            background = rounded(Color.WHITE, 12, stroke)
            setPadding(dp(14), dp(13), dp(14), dp(13))
            isClickable = true
            isFocusable = true
            setOnClickListener { onClick() }
        }
        row.addView(icon(iconId, blue, 20), LinearLayout.LayoutParams(dp(28), dp(28)))
        val copy = LinearLayout(this).apply { orientation = LinearLayout.VERTICAL }
        copy.addView(label(title, 15, Color.rgb(10, 27, 60), Typeface.BOLD).apply { gravity = Gravity.START })
        if (subtitle != null) {
            copy.addView(label(subtitle, 12, muted, Typeface.NORMAL).apply { gravity = Gravity.START; setPadding(0, dp(2), 0, 0) })
        }
        row.addView(copy, LinearLayout.LayoutParams(0, -2, 1f).apply { marginStart = dp(10) })

        if (badge != null) {
            row.addView(label(badge, 9, Color.WHITE, Typeface.BOLD).apply {
                background = rounded(Color.rgb(232, 34, 49), 50)
                gravity = Gravity.CENTER
            }, LinearLayout.LayoutParams(dp(16), dp(16)).apply { marginEnd = dp(6) })
        }

        row.addView(icon(R.drawable.ic_arrow_right, blue, 16))
        return row.apply { layoutParams = LinearLayout.LayoutParams(-1, -2).also { it.bottomMargin = dp(6) } }
    }

    private fun preferenceRow(parent: LinearLayout, title: String, subtitle: String, key: String, default: Boolean) {
        val row = LinearLayout(this).apply {
            orientation = LinearLayout.HORIZONTAL
            gravity = Gravity.CENTER_VERTICAL
            background = rounded(Color.WHITE, 13, stroke)
            setPadding(dp(11), dp(8), dp(7), dp(8))
        }
        val copy = LinearLayout(this).apply { orientation = LinearLayout.VERTICAL }
        copy.addView(label(title, 12, ink, Typeface.BOLD).apply { gravity = Gravity.START })
        copy.addView(label(subtitle, 9, muted, Typeface.NORMAL).apply { gravity = Gravity.START; setPadding(0, dp(3), 0, 0) })
        row.addView(copy, LinearLayout.LayoutParams(0, -2, 1f))
        row.addView(CheckBox(this).apply {
            isChecked = prefs.getBoolean(key, default)
            buttonTintList = android.content.res.ColorStateList.valueOf(blue)
            setOnCheckedChangeListener { _, checked -> prefs.edit().putBoolean(key, checked).apply() }
        })
        parent.addView(row, LinearLayout.LayoutParams(-1, -2).also { it.bottomMargin = dp(7) })
    }

    private fun sectionHeading(title: String, action: String? = null, onAction: (() -> Unit)? = null): View {
        val row = LinearLayout(this).apply {
            orientation = LinearLayout.HORIZONTAL
            gravity = Gravity.CENTER_VERTICAL
            setPadding(dp(1), dp(13), dp(1), dp(8))
        }
        row.addView(label(title, 15, ink, Typeface.BOLD).apply { gravity = Gravity.CENTER_VERTICAL or Gravity.START },
            LinearLayout.LayoutParams(0, -2, 1f))
        if (action != null) row.addView(label(action, 11, blue, Typeface.BOLD).apply {
            isClickable = true
            setOnClickListener { onAction?.invoke() }
        })
        return row
    }

    private fun chip(text: String, selected: Boolean, onClick: () -> Unit): View =
        label(text, 10, if (selected) Color.WHITE else ink, Typeface.BOLD).apply {
            background = rounded(if (selected) blue else Color.rgb(237, 241, 250), 50)
            isClickable = true
            isFocusable = true
            setOnClickListener { onClick() }
        }

    private fun primaryButton(text: String, color: Int, textColor: Int, arrow: Int?, onClick: () -> Unit): View {
        val row = LinearLayout(this).apply {
            orientation = LinearLayout.HORIZONTAL
            gravity = Gravity.CENTER
            background = rounded(color, 50)
            setPadding(dp(16), dp(10), dp(16), dp(10))
            isClickable = true
            isFocusable = true
            setOnClickListener { onClick() }
        }
        row.addView(label(text, 12, textColor, Typeface.BOLD))
        if (arrow != null) row.addView(icon(arrow, textColor, 17), LinearLayout.LayoutParams(dp(19), dp(19)).apply {
            marginStart = dp(5)
        })
        return row
    }

    private fun smallButton(text: String, color: Int, onClick: () -> Unit): View =
        label(text, 9, Color.WHITE, Typeface.BOLD).apply {
            background = rounded(color, 50)
            setPadding(dp(9), dp(9), dp(9), dp(9))
            isClickable = true
            setOnClickListener { onClick() }
        }

    private fun offlineNote() = label("Offline mode · Information is stored on this device.", 10, muted, Typeface.NORMAL).apply {
        gravity = Gravity.CENTER
        setPadding(0, dp(12), 0, dp(5))
    }

    private fun notificationButton(): View {
        val frame = FrameLayout(this).apply {
            isClickable = true
            isFocusable = true
            contentDescription = "Notifications"
            setOnClickListener { showNotifications() }
        }
        frame.addView(icon(R.drawable.ic_bell, Color.WHITE, 22),
            FrameLayout.LayoutParams(dp(38), dp(42), Gravity.CENTER))
        if (prefs.getBoolean("pref_updates", true)) {
            frame.addView(label("3", 9, Color.WHITE, Typeface.BOLD).apply { background = rounded(Color.rgb(232, 34, 49), 50) },
                FrameLayout.LayoutParams(dp(17), dp(17), Gravity.TOP or Gravity.RIGHT))
        }
        return frame
    }

    private fun iconButton(resource: Int, tint: Int, size: Int, onClick: () -> Unit): View =
        FrameLayout(this).apply {
            isClickable = true
            isFocusable = true
            setOnClickListener { onClick() }
            addView(icon(resource, tint, size), FrameLayout.LayoutParams(dp(30), dp(30), Gravity.CENTER))
        }

    private fun iconBadge(resource: Int, tint: Int, bg: Int, size: Int): View =
        FrameLayout(this).apply {
            background = rounded(bg, 15)
            addView(icon(resource, tint, 25), FrameLayout.LayoutParams(dp(size), dp(size), Gravity.CENTER))
            layoutParams = LinearLayout.LayoutParams(dp(size), dp(size))
        }

    private fun icon(resource: Int, tint: Int, size: Int): ImageView =
        ImageView(this).apply {
            setImageResource(resource)
            setColorFilter(tint)
            scaleType = ImageView.ScaleType.FIT_CENTER
            contentDescription = resources.getResourceEntryName(resource).removePrefix("ic_")
            layoutParams = LinearLayout.LayoutParams(dp(size), dp(size))
        }

    private fun photo(resource: Int, height: Int, radius: Int): ImageView =
        ImageView(this).apply {
            setImageResource(resource)
            scaleType = ImageView.ScaleType.CENTER_CROP
            background = rounded(Color.WHITE, radius)
            clipToOutline = true
            layoutParams = LinearLayout.LayoutParams(-1, dp(height))
        }

    private fun body(text: String, size: Int) = label(text, size, ink, Typeface.NORMAL).apply {
        gravity = Gravity.START
        setLineSpacing(dp(4).toFloat(), 1f)
    }

    private fun label(text: String, size: Int, color: Int, style: Int) = TextView(this).apply {
        this.text = text
        textSize = size.toFloat()
        setTextColor(color)
        typeface = Typeface.create("sans-serif", style)
        gravity = Gravity.CENTER
    }

    private fun rounded(color: Int, radius: Int, outline: Int? = null) = GradientDrawable().apply {
        setColor(color)
        cornerRadius = dp(radius).toFloat()
        if (outline != null) setStroke(dp(1), outline)
    }

    override fun onBackPressed() {
        showHome()
    }

    private fun dp(value: Int): Int = (value * resources.displayMetrics.density).toInt()
}
