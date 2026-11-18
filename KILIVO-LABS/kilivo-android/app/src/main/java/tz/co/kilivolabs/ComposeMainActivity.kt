package tz.co.kilivolabs

import android.graphics.Bitmap
import android.graphics.BitmapFactory
import android.net.Uri
import android.os.Bundle
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.result.contract.ActivityResultContracts
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.BoxWithConstraints
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.WindowInsets
import androidx.compose.foundation.layout.fillMaxHeight
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.navigationBars
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.GenericShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ArrowBack
import androidx.compose.material.icons.filled.ArrowForward
import androidx.compose.material.icons.filled.Apartment
import androidx.compose.material.icons.filled.BusinessCenter
import androidx.compose.material.icons.filled.CalendarToday
import androidx.compose.material.icons.filled.CameraAlt
import androidx.compose.material.icons.filled.CheckCircle
import androidx.compose.material.icons.filled.CloudOff
import androidx.compose.material.icons.filled.Code
import androidx.compose.material.icons.filled.Engineering
import androidx.compose.material.icons.filled.ExpandLess
import androidx.compose.material.icons.filled.ExpandMore
import androidx.compose.material.icons.filled.Favorite
import androidx.compose.material.icons.filled.Folder
import androidx.compose.material.icons.filled.GridView
import androidx.compose.material.icons.filled.Help
import androidx.compose.material.icons.filled.Home
import androidx.compose.material.icons.filled.Groups
import androidx.compose.material.icons.filled.InsertChart
import androidx.compose.material.icons.filled.LocalShipping
import androidx.compose.material.icons.filled.Logout
import androidx.compose.material.icons.filled.Menu
import androidx.compose.material.icons.filled.MenuBook
import androidx.compose.material.icons.filled.MoreVert
import androidx.compose.material.icons.filled.Notifications
import androidx.compose.material.icons.filled.Person
import androidx.compose.material.icons.filled.Search
import androidx.compose.material.icons.filled.Settings
import androidx.compose.material.icons.filled.Shield
import androidx.compose.material.icons.filled.AccountTree
import androidx.compose.material.icons.filled.ShoppingCart
import androidx.compose.material.icons.filled.TrackChanges
import androidx.compose.material.icons.filled.Visibility
import androidx.compose.material.icons.filled.VisibilityOff
import androidx.compose.material.icons.filled.VolunteerActivism
import androidx.compose.material3.AlertDialog
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.Divider
import androidx.compose.material3.DropdownMenu
import androidx.compose.material3.DropdownMenuItem
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateListOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.asImageBitmap
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.text.input.PasswordVisualTransformation
import androidx.compose.ui.text.input.VisualTransformation
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import kotlinx.coroutines.delay
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext

private data class ComposeFeature(val title: String, val subtitle: String, val icon: ImageVector)
private data class ComposeDivision(
    val id: String,
    val title: String,
    val shortTitle: String,
    val subtitle: String,
    val description: String,
    val color: Color,
    val pale: Color,
    val icon: ImageVector,
    val image: Int,
    val section: String,
    val features: List<ComposeFeature>
)
private data class ComposeNews(
    val title: String,
    val date: String,
    val category: String,
    val image: Int,
    val description: String
)
private data class ComposeMember(
    val id: String,
    val name: String,
    val role: String,
    val department: String,
    val email: String
)
private data class ComposeWorkspaceRecord(
    val id: String,
    val title: String,
    val subtitle: String,
    val status: String,
    val date: String
)
private data class ComposeNotice(
    val id: String,
    val title: String,
    val message: String,
    val date: String,
    val isRead: Boolean
)
private enum class ComposeScreen {
    Splash, Welcome, Login, Home, Divisions, Search, Updates, Profile, EditAccount, DivisionDetail,
    UpdateDetail, Preferences, About, Help, Privacy, Notifications, Announcements,
    AnnouncementDetail, Members, MemberDetail, Organization, Department, Assignments,
    Projects, ProjectDetail, Events, EventDetail, Documents, DocumentDetail, Donation,
    DonationCheckout, Pledges, Interests
}
private data class ComposeRoute(val screen: ComposeScreen, val value: String = "")
private data class ComposeTab(val label: String, val icon: ImageVector, val screen: ComposeScreen)

class ComposeMainActivity : ComponentActivity() {
    @Suppress("DEPRECATION")
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        window.statusBarColor = android.graphics.Color.rgb(246, 248, 253)
        window.navigationBarColor = android.graphics.Color.WHITE
        window.decorView.systemUiVisibility =
            android.view.View.SYSTEM_UI_FLAG_LIGHT_STATUS_BAR or
                android.view.View.SYSTEM_UI_FLAG_LIGHT_NAVIGATION_BAR
        setContent { KilivoComposeApp() }
    }
}

private val KilivoNavy = Color(0xFF073087)
private val KilivoBlue = Color(0xFF0F4CCF)
private val KilivoInk = Color(0xFF0F2353)
private val KilivoMuted = Color(0xFF52658E)
private val KilivoBackground = Color(0xFFF6F8FD)
private val KilivoStroke = Color(0xFFDCE5F8)
private val ComposeTabs = listOf(
    ComposeTab("Home", Icons.Filled.Home, ComposeScreen.Home),
    ComposeTab("Divisions", Icons.Filled.GridView, ComposeScreen.Divisions),
    ComposeTab("Search", Icons.Filled.Search, ComposeScreen.Search),
    ComposeTab("Updates", Icons.Filled.InsertChart, ComposeScreen.Updates),
    ComposeTab("Profile", Icons.Filled.Person, ComposeScreen.Profile)
)
private val RoundedShieldShape = GenericShape { size, path ->
    moveTo(size.width * 0.20f, size.height * 0.05f)
    quadraticTo(size.width * 0.10f, size.height * 0.05f, size.width * 0.07f, size.height * 0.16f)
    lineTo(size.width * 0.04f, size.height * 0.31f)
    quadraticTo(size.width * 0.03f, size.height * 0.36f, size.width * 0.07f, size.height * 0.41f)
    lineTo(size.width * 0.45f, size.height * 0.91f)
    quadraticTo(size.width * 0.50f, size.height * 0.99f, size.width * 0.55f, size.height * 0.91f)
    lineTo(size.width * 0.93f, size.height * 0.41f)
    quadraticTo(size.width * 0.97f, size.height * 0.36f, size.width * 0.96f, size.height * 0.31f)
    lineTo(size.width * 0.93f, size.height * 0.16f)
    quadraticTo(size.width * 0.90f, size.height * 0.05f, size.width * 0.80f, size.height * 0.05f)
    close()
}

@Composable
private fun KilivoComposeApp() {
    val context = LocalContext.current
    val prefs = remember { context.getSharedPreferences("kilivo-offline", android.content.Context.MODE_PRIVATE) }
    val divisions = remember { composeDivisions() }
    val updates = remember { composeUpdates() }
    val announcements = remember { composeAnnouncements() }
    val members = remember { composeMembers() }
    val assignments = remember { composeAssignments() }
    val events = remember { composeEvents() }
    val documents = remember { composeDocuments() }
    val notifications = remember { mutableStateListOf<ComposeNotice>().apply { addAll(composeNotifications()) } }
    val stack = remember {
        mutableStateListOf(ComposeRoute(ComposeScreen.Splash))
    }
    var started by remember { mutableStateOf(false) }
    var drawerOpen by remember { mutableStateOf(false) }
    var profileName by remember { mutableStateOf(prefs.getString("profile_name", "Mudhihiri Selemani") ?: "Mudhihiri Selemani") }
    var accountEmail by remember { mutableStateOf(prefs.getString("account_email", "") ?: "") }
    var profileImageUri by remember { mutableStateOf(prefs.getString("profile_image_uri", null)) }
    var formDialog by remember { mutableStateOf<String?>(null) }
    val profileImagePicker = rememberLauncherForActivityResult(ActivityResultContracts.OpenDocument()) { uri ->
        if (uri != null) {
            try {
                context.contentResolver.takePersistableUriPermission(
                    uri,
                    android.content.Intent.FLAG_GRANT_READ_URI_PERMISSION
                )
                profileImageUri = uri.toString()
                prefs.edit().putString("profile_image_uri", profileImageUri).apply()
            } catch (_: SecurityException) {
                formDialog = "profile_image_error"
            }
        }
    }
    var searchText by remember { mutableStateOf("") }
    var memberSearch by remember { mutableStateOf("") }
    var newsFilter by remember { mutableStateOf("All") }
    var donationAmount by remember { mutableStateOf("TZS 10,000") }
    var donationProgram by remember { mutableStateOf("Community Development") }
    var formContact by remember { mutableStateOf("") }
    var otherAmount by remember { mutableStateOf("") }
    var selectedInterest by remember { mutableStateOf("") }
    var selectedDivision by remember { mutableStateOf("") }
    var selectedPaymentMethod by remember { mutableStateOf("Mobile money") }

    fun navigate(screen: ComposeScreen, value: String = "") {
        if (screen in ComposeTabs.map { it.screen }) {
            stack.clear()
            stack.add(ComposeRoute(screen, value))
            searchText = ""
        } else {
            stack.add(ComposeRoute(screen, value))
        }
    }
    fun replaceRoute(screen: ComposeScreen, value: String = "") {
        stack.clear()
        stack.add(ComposeRoute(screen, value))
    }
    fun back() {
        if (stack.size > 1) stack.removeAt(stack.lastIndex)
        else navigate(ComposeScreen.Home)
    }
    fun showInterest(division: ComposeDivision, interest: String) {
        selectedDivision = division.id
        selectedInterest = interest
        formContact = ""
        formDialog = "interest"
    }
    fun saveInterest() {
        val saved = prefs.getStringSet("interests", emptySet()).orEmpty().toMutableSet()
        val division = divisions.first { it.id == selectedDivision }
        saved.add("${System.currentTimeMillis()}|${division.title}|$selectedInterest|${formContact.trim()}")
        prefs.edit().putStringSet("interests", saved).apply()
        formDialog = "interest_saved"
    }

    LaunchedEffect(Unit) {
        delay(1300)
        stack[0] = ComposeRoute(
            if (prefs.getBoolean("onboarding_complete", false)) ComposeScreen.Login else ComposeScreen.Welcome
        )
        started = true
    }

    MaterialTheme(colorScheme = lightColorScheme(
        primary = KilivoBlue,
        secondary = KilivoNavy,
        background = KilivoBackground,
        surface = Color.White,
        onPrimary = Color.White,
        onBackground = KilivoInk,
        onSurface = KilivoInk
    )) {
        val route = stack.last()
        val isEntryScreen = route.screen in setOf(ComposeScreen.Splash, ComposeScreen.Welcome, ComposeScreen.Login)
        Box(Modifier.fillMaxSize()) {
            Scaffold(
                containerColor = KilivoBackground,
                contentWindowInsets = WindowInsets(0, 0, 0, 0),
                topBar = {
                    if (!isEntryScreen) {
                        ComposeToolbar(
                            route = route,
                            title = toolbarTitle(route, divisions, updates),
                            onBack = ::back,
                            onMenu = { drawerOpen = true },
                            onNotifications = { navigate(ComposeScreen.Notifications) },
                            unreadNotifications = notifications.count { !it.isRead }
                        )
                    }
                },
                bottomBar = {
                    if (!isEntryScreen) {
                        ComposeBottomBar(
                            active = tabFor(route.screen),
                            onSelect = { navigate(it) }
                        )
                    }
                }
            ) { insets ->
                Box(Modifier.fillMaxSize().padding(insets)) {
                    when (route.screen) {
                    ComposeScreen.Splash -> SplashScreen()
                    ComposeScreen.Welcome -> WelcomeScreen(divisions) {
                        prefs.edit().putBoolean("onboarding_complete", true).apply()
                        navigate(ComposeScreen.Login)
                    }
                    ComposeScreen.Login -> LoginScreen(
                        onSignIn = { identifier, _ ->
                            if (identifier.isNotBlank()) {
                                replaceRoute(ComposeScreen.Home)
                            }
                        },
                        onForgotPassword = { formDialog = "password_help" }
                    )
                    ComposeScreen.Home -> HomeScreen(divisions, ::navigate)
                    ComposeScreen.Divisions -> DivisionsScreen(divisions) {
                        navigate(ComposeScreen.DivisionDetail, it.id)
                    }
                    ComposeScreen.DivisionDetail -> divisions.firstOrNull { it.id == route.value }?.let { division ->
                        DivisionDetailScreen(
                            division = division,
                            onInterest = { showInterest(division, it) },
                            onDonate = { navigate(ComposeScreen.Donation) }
                        )
                    }
                    ComposeScreen.Search -> SearchScreen(
                        divisions = divisions,
                        updates = updates,
                        announcements = announcements,
                        projects = assignments,
                        query = searchText,
                        onQueryChange = { searchText = it },
                        onDivision = { navigate(ComposeScreen.DivisionDetail, it.id) },
                        onUpdate = { item ->
                            val source = if (item in announcements) announcements else updates
                            val target = if (source === announcements) ComposeScreen.AnnouncementDetail else ComposeScreen.UpdateDetail
                            navigate(target, source.indexOf(item).toString())
                        },
                        onProject = { navigate(ComposeScreen.Projects) }
                    )
                    ComposeScreen.Updates -> UpdatesScreen(
                        updates = updates,
                        filter = newsFilter,
                        onFilter = { newsFilter = it },
                        onSelect = { navigate(ComposeScreen.UpdateDetail, updates.indexOf(it).toString()) }
                    )
                    ComposeScreen.UpdateDetail -> updates.getOrNull(route.value.toIntOrNull() ?: -1)?.let {
                        UpdateDetailScreen(it)
                    }
                    ComposeScreen.Announcements -> AnnouncementsScreen(announcements) {
                        navigate(ComposeScreen.AnnouncementDetail, announcements.indexOf(it).toString())
                    }
                    ComposeScreen.AnnouncementDetail -> announcements.getOrNull(route.value.toIntOrNull() ?: -1)?.let {
                        AnnouncementDetailScreen(it)
                    }
                    ComposeScreen.Members -> MemberDirectoryScreen(members, memberSearch, { memberSearch = it }) {
                        navigate(ComposeScreen.MemberDetail, it.id)
                    }
                    ComposeScreen.MemberDetail -> members.firstOrNull { it.id == route.value }?.let {
                        MemberDetailScreen(it)
                    }
                    ComposeScreen.Organization -> OrganizationScreen()
                    ComposeScreen.Department -> DepartmentScreen(profileName, divisions.first())
                    ComposeScreen.Assignments -> WorkspaceListScreen(
                        title = "My Assignments",
                        subtitle = "Work assigned to your account.",
                        icon = Icons.Filled.CheckCircle,
                        records = assignments
                    )
                    ComposeScreen.Projects -> WorkspaceListScreen(
                        title = "Projects",
                        subtitle = "Projects available to your division.",
                        icon = Icons.Filled.Folder,
                        records = assignments.filter { it.id.startsWith("project-") },
                        onSelect = { navigate(ComposeScreen.ProjectDetail, it.id) }
                    )
                    ComposeScreen.ProjectDetail -> assignments.firstOrNull { it.id == route.value }?.let {
                        WorkspaceDetailScreen("Project details", it, Icons.Filled.Folder)
                    }
                    ComposeScreen.Events -> EventsScreen(events) {
                        navigate(ComposeScreen.EventDetail, it.id)
                    }
                    ComposeScreen.EventDetail -> events.firstOrNull { it.id == route.value }?.let {
                        WorkspaceDetailScreen("Event details", it, Icons.Filled.CalendarToday)
                    }
                    ComposeScreen.Documents -> DocumentsScreen(documents) {
                        navigate(ComposeScreen.DocumentDetail, it.id)
                    }
                    ComposeScreen.DocumentDetail -> documents.firstOrNull { it.id == route.value }?.let {
                        DocumentDetailScreen(it) { formDialog = "document_preview" }
                    }
                    ComposeScreen.Profile -> ProfileScreen(profileName, accountEmail, profileImageUri) {
                        when (it) {
                            "My Donations" -> navigate(ComposeScreen.Pledges)
                            "My Interests" -> navigate(ComposeScreen.Interests)
                            "About KILIVO LABS" -> navigate(ComposeScreen.About)
                            "Help & Support" -> navigate(ComposeScreen.Help)
                            "Privacy & Security" -> navigate(ComposeScreen.Privacy)
                        }
                    }
                    ComposeScreen.EditAccount -> EditAccountScreen(
                        displayName = profileName,
                        email = accountEmail,
                        imageUri = profileImageUri,
                        onPickImage = { profileImagePicker.launch(arrayOf("image/*")) },
                        onSave = { updatedName, updatedEmail, passwordChange ->
                            profileName = updatedName
                            accountEmail = updatedEmail
                            prefs.edit()
                                .putString("profile_name", updatedName)
                                .putString("account_email", updatedEmail)
                                .apply()
                            replaceRoute(ComposeScreen.Profile)
                            formDialog = if (passwordChange) "account_password_preview" else "account_saved"
                        }
                    )
                    ComposeScreen.Preferences -> PreferencesScreen(prefs)
                    ComposeScreen.About -> AboutScreen(divisions) { navigate(ComposeScreen.DivisionDetail, it.id) }
                    ComposeScreen.Help -> HelpScreen()
                    ComposeScreen.Privacy -> PrivacyScreen(
                        onClear = { formDialog = "clear_data" }
                    )
                    ComposeScreen.Notifications -> NotificationsScreen(
                        notifications = notifications,
                        onRead = { notification ->
                            val index = notifications.indexOfFirst { it.id == notification.id }
                            if (index >= 0) notifications[index] = notification.copy(isRead = true)
                        }
                    )
                    ComposeScreen.Donation -> DonationScreen(
                        amount = donationAmount,
                        onAmount = { donationAmount = it },
                        program = donationProgram,
                        onProgram = { donationProgram = it },
                        onOtherAmount = { formDialog = "other_amount" },
                        onSave = { navigate(ComposeScreen.DonationCheckout) }
                    )
                    ComposeScreen.DonationCheckout -> DonationCheckoutScreen(
                        amount = donationAmount,
                        program = donationProgram,
                        paymentMethod = selectedPaymentMethod,
                        onPaymentMethod = { selectedPaymentMethod = it },
                        onContinue = { formDialog = "checkout_preview" }
                    )
                    ComposeScreen.Pledges -> DonationHistoryScreen(composeDonationHistory())
                    ComposeScreen.Interests -> SavedListScreen(
                        title = "My Interests",
                        items = prefs.getStringSet("interests", emptySet()).orEmpty().toList().sortedDescending(),
                        emptyTitle = "No interests saved",
                        emptyBody = "Your saved offline interests will appear here."
                    )
                    }
                    if (!started && route.screen == ComposeScreen.Splash) Unit
                }
            }

            if (drawerOpen) {
                ComposeDrawer(profileName, profileImageUri, onDismiss = { drawerOpen = false }) { item ->
                    drawerOpen = false
                    when (item) {
                        "Company Overview" -> navigate(ComposeScreen.About)
                        "Edit Account" -> navigate(ComposeScreen.EditAccount)
                        "Members Directory" -> navigate(ComposeScreen.Members)
                        "Organization Structure" -> navigate(ComposeScreen.Organization)
                        "My Department / Division" -> navigate(ComposeScreen.Department)
                        "My Assignments & Projects" -> navigate(ComposeScreen.Assignments)
                        "Meetings & Events" -> navigate(ComposeScreen.Events)
                        "Documents & Resources" -> navigate(ComposeScreen.Documents)
                        "Official Announcements",
                        "Internal Communication" -> navigate(ComposeScreen.Announcements)
                        "App Settings" -> navigate(ComposeScreen.Preferences)
                        "Privacy & Security" -> navigate(ComposeScreen.Privacy)
                        "Logout" -> formDialog = "logout"
                    }
                }
            }
        }
        when (formDialog) {
            "interest" -> AlertDialog(
                onDismissRequest = { formDialog = null },
                title = { Text("Save interest offline") },
                text = {
                    Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                        Text("$selectedInterest · ${divisions.first { it.id == selectedDivision }.title}")
                        Text("Member: $profileName (read-only)", color = KilivoMuted)
                        Text("Preview only. This request is not sent to KILIVO LABS.", color = KilivoMuted)
                        OutlinedTextField(formContact, { formContact = it }, label = { Text("Phone or email (optional)") }, singleLine = true)
                    }
                },
                confirmButton = { TextButton(onClick = ::saveInterest) { Text("Save") } },
                dismissButton = { TextButton(onClick = { formDialog = null }) { Text("Cancel") } }
            )
            "interest_saved" -> AlertDialog(
                onDismissRequest = { formDialog = null },
                title = { Text("Preview saved") },
                text = { Text("This sample interest is saved on this device only. API submission is not connected.") },
                confirmButton = { TextButton(onClick = { formDialog = null }) { Text("OK") } }
            )
            "password_help" -> AlertDialog(
                onDismissRequest = { formDialog = null },
                title = { Text("Password assistance") },
                text = { Text("Password reset will be provided by the company account service. It is not connected in this preview.") },
                confirmButton = { TextButton(onClick = { formDialog = null }) { Text("OK") } }
            )
            "profile_image_error" -> AlertDialog(
                onDismissRequest = { formDialog = null },
                title = { Text("Could not save profile photo") },
                text = { Text("Please choose the photo again and allow Kilivo to access it.") },
                confirmButton = { TextButton(onClick = { formDialog = null }) { Text("OK") } }
            )
            "account_saved" -> AlertDialog(
                onDismissRequest = { formDialog = null },
                title = { Text("Account preview updated") },
                text = { Text("Your display name, email and profile photo are saved on this device only. Account updates are not connected to the company server.") },
                confirmButton = { TextButton(onClick = { formDialog = null }) { Text("OK") } }
            )
            "account_password_preview" -> AlertDialog(
                onDismissRequest = { formDialog = null },
                title = { Text("Account preview updated") },
                text = { Text("Your display name and email are saved on this device only. The password change has not been submitted or saved; connect the account service to change login credentials.") },
                confirmButton = { TextButton(onClick = { formDialog = null }) { Text("OK") } }
            )
            "checkout_preview" -> AlertDialog(
                onDismissRequest = { formDialog = null },
                title = { Text("Payment preview") },
                text = { Text("A secure checkout session for $donationProgram · $donationAmount via $selectedPaymentMethod will be requested from the server. No payment has been started or recorded in this preview.") },
                confirmButton = { TextButton(onClick = { formDialog = null }) { Text("OK") } }
            )
            "document_preview" -> AlertDialog(
                onDismissRequest = { formDialog = null },
                title = { Text("Secure document preview") },
                text = { Text("The API will provide an authorized, short-lived download link. No document is downloaded in this preview.") },
                confirmButton = { TextButton(onClick = { formDialog = null }) { Text("OK") } }
            )
            "other_amount" -> AlertDialog(
                onDismissRequest = { formDialog = null },
                title = { Text("Other donation amount") },
                text = {
                    OutlinedTextField(
                        otherAmount, { otherAmount = it },
                        label = { Text("Amount in TZS") },
                        keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number),
                        singleLine = true
                    )
                },
                confirmButton = {
                    TextButton(onClick = {
                        otherAmount.toLongOrNull()?.let { donationAmount = "TZS ${"%,d".format(it)}" }
                        formDialog = null
                    }) { Text("Use amount") }
                },
                dismissButton = { TextButton(onClick = { formDialog = null }) { Text("Cancel") } }
            )
            "logout" -> AlertDialog(
                onDismissRequest = { formDialog = null },
                title = { Text("Leave KILIVO LABS?") },
                text = { Text("Your offline profile and saved items will remain on this device.") },
                confirmButton = {
                    TextButton(onClick = {
                        replaceRoute(ComposeScreen.Login)
                        formDialog = null
                    }) { Text("Logout") }
                },
                dismissButton = { TextButton(onClick = { formDialog = null }) { Text("Cancel") } }
            )
            "clear_data" -> AlertDialog(
                onDismissRequest = { formDialog = null },
                title = { Text("Clear local app data?") },
                text = { Text("This removes your profile name, preferences and local pledges from this device.") },
                confirmButton = {
                    TextButton(onClick = {
                        prefs.edit().clear().apply()
                        profileName = "Mudhihiri Selemani"
                        formDialog = null
                        stack.clear()
                        stack.add(ComposeRoute(ComposeScreen.Welcome))
                    }) { Text("Clear") }
                },
                dismissButton = { TextButton(onClick = { formDialog = null }) { Text("Cancel") } }
            )
            else -> Unit
        }
    }
}

@Composable
private fun ComposeToolbar(
    route: ComposeRoute,
    title: String,
    onBack: () -> Unit,
    onMenu: () -> Unit,
    onNotifications: () -> Unit,
    unreadNotifications: Int
) {
    val isHome = route.screen == ComposeScreen.Home
    val barColor = when (route.screen) {
        ComposeScreen.DivisionDetail -> KilivoNavy
        else -> KilivoNavy
    }
    Row(
        Modifier.fillMaxWidth().height(64.dp).background(barColor).padding(horizontal = 10.dp),
        verticalAlignment = Alignment.CenterVertically
    ) {
        IconButton(onClick = if (isHome) onMenu else onBack) {
            Icon(if (isHome) Icons.Filled.Menu else Icons.Filled.ArrowBack,
                contentDescription = if (isHome) "Open menu" else "Back",
                tint = Color.White, modifier = Modifier.size(28.dp))
        }
        if (isHome) {
            Column(Modifier.weight(1f), horizontalAlignment = Alignment.CenterHorizontally) {
                Text("KILIVO LABS", color = Color.White, fontWeight = FontWeight.Bold, fontSize = 17.sp)
                Text("Our Family. Your Partner.", color = Color.White, fontSize = 11.sp)
            }
            IconButton(onClick = onNotifications) {
                Box {
                    Icon(Icons.Filled.Notifications, "Notifications", tint = Color.White, modifier = Modifier.size(27.dp))
                    if (unreadNotifications > 0) {
                        Text(
                            unreadNotifications.coerceAtMost(99).toString(),
                            Modifier.align(Alignment.TopEnd).background(Color.Red, CircleShape)
                                .padding(horizontal = 4.dp, vertical = 1.dp),
                            color = Color.White,
                            fontSize = 8.sp,
                            fontWeight = FontWeight.Bold
                        )
                    }
                }
            }
        } else {
            Text(title, Modifier.weight(1f), color = Color.White, fontWeight = FontWeight.Bold, fontSize = 17.sp,
                maxLines = 1, overflow = TextOverflow.Ellipsis)
            Spacer(Modifier.width(42.dp))
        }
    }
}

@Composable
private fun ComposeBottomBar(active: ComposeScreen, onSelect: (ComposeScreen) -> Unit) {
    Row(
        Modifier.fillMaxWidth().height(62.dp).background(Color.White),
        horizontalArrangement = Arrangement.SpaceEvenly,
        verticalAlignment = Alignment.CenterVertically
    ) {
        ComposeTabs.forEach { tab ->
            val selected = active == tab.screen || (active == ComposeScreen.DivisionDetail && tab.screen == ComposeScreen.Divisions)
            val tint = if (selected) KilivoBlue else Color(0xFF576991)
            Column(
                Modifier.weight(1f).fillMaxHeight().clickable { onSelect(tab.screen) }.padding(vertical = 5.dp),
                horizontalAlignment = Alignment.CenterHorizontally,
                verticalArrangement = Arrangement.Center
            ) {
                Icon(tab.icon, tab.label, tint = tint, modifier = Modifier.size(23.dp))
                Text(tab.label, color = tint, fontSize = 10.sp, fontWeight = if (selected) FontWeight.Bold else FontWeight.Normal)
            }
        }
    }
}

@Composable
private fun ComposeDrawer(
    profileName: String,
    profileImageUri: String?,
    onDismiss: () -> Unit,
    onSelect: (String) -> Unit
) {
    var actionsExpanded by remember { mutableStateOf(false) }
    val sections = listOf(
        "COMPANY" to listOf(
            Icons.Filled.Apartment to "Company Overview",
            Icons.Filled.Groups to "Members Directory",
            Icons.Filled.AccountTree to "Organization Structure"
        ),
        "WORKSPACE" to listOf(
            Icons.Filled.BusinessCenter to "My Department / Division",
            Icons.Filled.Folder to "My Assignments & Projects",
            Icons.Filled.CalendarToday to "Meetings & Events",
            Icons.Filled.MenuBook to "Documents & Resources"
        ),
        "COMMUNICATION" to listOf(
            Icons.Filled.Notifications to "Official Announcements",
            Icons.Filled.Menu to "Internal Communication"
        ),
        "ACCOUNT" to listOf(
            Icons.Filled.Settings to "App Settings",
            Icons.Filled.Shield to "Privacy & Security",
            Icons.Filled.Help to "Help & Support",
            Icons.Filled.Logout to "Logout"
        )
    )

    BoxWithConstraints(Modifier.fillMaxSize().background(Color.Black.copy(alpha = 0.68f))) {
        val drawerWidth = minOf(maxWidth, 235.dp)
        Row(Modifier.fillMaxSize()) {
            Column(
                Modifier.width(drawerWidth)
                    .fillMaxHeight()
                    .background(Color(0xFF050505))
                    .verticalScroll(rememberScrollState())
                    .padding(horizontal = 20.dp, vertical = 14.dp)
            ) {
                Row(
                    Modifier.fillMaxWidth().padding(bottom = 4.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    ProfileAvatar(profileImageUri, 50)
                    Column(Modifier.weight(1f).padding(start = 12.dp)) {
                        Text(profileName, color = Color.White, fontWeight = FontWeight.Bold, fontSize = 14.sp)
                        Text("Company Member", color = Color(0xFF8F939C), fontSize = 11.sp)
                        Text("Member ID", color = Color(0xFF8F939C), fontSize = 11.sp)
                    }
                }
                Row(Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.End) {
                    Box {
                        IconButton(onClick = { actionsExpanded = true }) {
                            Icon(Icons.Filled.MoreVert, "Menu options", tint = Color.White)
                        }
                        DropdownMenu(
                            expanded = actionsExpanded,
                            onDismissRequest = { actionsExpanded = false }
                        ) {
                            DropdownMenuItem(
                                text = { Text("Edit Account") },
                                onClick = {
                                    actionsExpanded = false
                                    onSelect("Edit Account")
                                }
                            )
                        }
                    }
                }
                Divider(color = Color(0xFF24262A))
                sections.forEachIndexed { index, (heading, items) ->
                    var isExpanded by remember { mutableStateOf(false) }
                    Row(
                        Modifier.fillMaxWidth()
                            .clickable {
                                isExpanded = !isExpanded
                            }
                            .padding(top = 22.dp, bottom = 10.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Text(
                            heading,
                            Modifier.weight(1f),
                            color = Color(0xFFD8D9DD),
                            fontWeight = FontWeight.Bold,
                            fontSize = 12.sp
                        )
                        Icon(
                            if (isExpanded) Icons.Filled.ExpandLess else Icons.Filled.ExpandMore,
                            contentDescription = if (isExpanded) "Collapse $heading" else "Expand $heading",
                            tint = Color(0xFF8F939C),
                            modifier = Modifier.size(18.dp)
                        )
                    }
                    if (isExpanded) {
                        items.forEach { (icon, label) ->
                            Row(
                                Modifier.fillMaxWidth()
                                    .clickable { onSelect(label) }
                                    .padding(vertical = 11.dp),
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Icon(icon, null, tint = if (label == "Logout") Color(0xFFE35C64) else Color(0xFF4285F4),
                                    modifier = Modifier.size(21.dp))
                                Text(
                                    label,
                                    Modifier.padding(start = 14.dp),
                                    color = if (label == "Logout") Color(0xFFE35C64) else Color(0xFFF2F2F4),
                                    fontSize = 14.sp
                                )
                            }
                        }
                    }
                    if (index < sections.lastIndex) {
                        Divider(Modifier.padding(top = 6.dp), color = Color(0xFF24262A))
                    }
                }
            }
            Box(Modifier.weight(1f).fillMaxHeight().clickable(onClick = onDismiss))
        }
    }
}

@Composable
private fun LoginScreen(
    onSignIn: (String, String) -> Unit,
    onForgotPassword: () -> Unit
) {
    var identifier by remember { mutableStateOf("") }
    var password by remember { mutableStateOf("") }
    var showPassword by remember { mutableStateOf(false) }
    Column(
        Modifier.fillMaxSize().verticalScroll(rememberScrollState()).padding(24.dp),
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        Spacer(Modifier.height(36.dp))
        Image(painterResource(R.drawable.ic_logo_mark), "KILIVO LABS logo", Modifier.size(82.dp))
        Text("Member sign in", Modifier.padding(top = 18.dp), color = KilivoInk,
            fontSize = 25.sp, fontWeight = FontWeight.Bold)
        Text("Sign in with your company account.", Modifier.padding(top = 6.dp, bottom = 22.dp),
            color = KilivoMuted, textAlign = TextAlign.Center)
        PreviewBanner()
        OutlinedTextField(
            value = identifier,
            onValueChange = { identifier = it },
            modifier = Modifier.fillMaxWidth().padding(top = 18.dp),
            label = { Text("Company email or phone") },
            singleLine = true,
            keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Email)
        )
        OutlinedTextField(
            value = password,
            onValueChange = { password = it },
            modifier = Modifier.fillMaxWidth().padding(top = 10.dp),
            label = { Text("Password") },
            singleLine = true,
            visualTransformation = if (showPassword) VisualTransformation.None else PasswordVisualTransformation(),
            trailingIcon = {
                IconButton(onClick = { showPassword = !showPassword }) {
                    Icon(
                        if (showPassword) Icons.Filled.VisibilityOff else Icons.Filled.Visibility,
                        contentDescription = if (showPassword) "Hide password" else "Show password"
                    )
                }
            },
            keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Password)
        )
        TextButton(onClick = onForgotPassword, modifier = Modifier.align(Alignment.End)) {
            Text("Forgot password?")
        }
        PrimaryComposeButton(
            "Preview Sign In",
            Modifier.fillMaxWidth(),
            enabled = identifier.isNotBlank() && password.isNotBlank()
        ) { onSignIn(identifier.trim(), password) }
        Text(
            "Company member accounts are provisioned by an administrator. Sign-in is a UI preview; no credentials are checked.",
            Modifier.padding(top = 14.dp),
            color = KilivoMuted,
            fontSize = 12.sp,
            textAlign = TextAlign.Center
        )
    }
}

@Composable
private fun PreviewBanner() {
    InfoPanel(
        Icons.Filled.CloudOff,
        KilivoBlue,
        "Preview data",
        "The API is not connected yet. Information and actions on these screens are sample UI only."
    )
}

@Composable
private fun MemberDirectoryScreen(
    members: List<ComposeMember>,
    query: String,
    onQuery: (String) -> Unit,
    onSelect: (ComposeMember) -> Unit
) {
    val filtered = members.filter {
        "${it.name} ${it.role} ${it.department}".contains(query, ignoreCase = true)
    }
    LazyColumn(
        Modifier.fillMaxSize(),
        contentPadding = androidx.compose.foundation.layout.PaddingValues(15.dp),
        verticalArrangement = Arrangement.spacedBy(10.dp)
    ) {
        item {
            PreviewBanner()
            Text("Company members", Modifier.padding(top = 10.dp), fontSize = 21.sp,
                fontWeight = FontWeight.Bold, color = KilivoInk)
            OutlinedTextField(
                query, onQuery,
                modifier = Modifier.fillMaxWidth().padding(top = 8.dp),
                label = { Text("Search members") },
                leadingIcon = { Icon(Icons.Filled.Search, null) },
                singleLine = true
            )
        }
        if (filtered.isEmpty()) item { EmptyCard("No sample members match this search.") }
        items(filtered, key = { it.id }) { member ->
            Card(
                Modifier.fillMaxWidth().clickable { onSelect(member) },
                colors = CardDefaults.cardColors(containerColor = Color.White),
                border = androidx.compose.foundation.BorderStroke(1.dp, KilivoStroke),
                shape = RoundedCornerShape(16.dp)
            ) {
                Row(Modifier.fillMaxWidth().padding(14.dp), verticalAlignment = Alignment.CenterVertically) {
                    IconBadge(Icons.Filled.Person, KilivoBlue, Color(0xFFE7EEFB), 48)
                    Column(Modifier.weight(1f).padding(horizontal = 12.dp)) {
                        Text(member.name, color = KilivoInk, fontWeight = FontWeight.Bold, fontSize = 15.sp)
                        Text(member.role, color = KilivoBlue, fontSize = 12.sp)
                        Text(member.department, color = KilivoMuted, fontSize = 12.sp)
                    }
                    RoundArrow(KilivoBlue)
                }
            }
        }
    }
}

@Composable
private fun MemberDetailScreen(member: ComposeMember) {
    Column(
        Modifier.fillMaxSize().verticalScroll(rememberScrollState()).padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(12.dp)
    ) {
        PreviewBanner()
        InfoPanel(Icons.Filled.Person, KilivoBlue, member.name, member.role)
        InfoPanel(Icons.Filled.Apartment, KilivoBlue, "Department", member.department)
        InfoPanel(Icons.Filled.Notifications, KilivoBlue, "Company email", member.email)
        Text("Directory details are read-only.", color = KilivoMuted, fontSize = 13.sp)
    }
}

@Composable
private fun OrganizationScreen() {
    Column(
        Modifier.fillMaxSize().verticalScroll(rememberScrollState()).padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(10.dp)
    ) {
        PreviewBanner()
        SectionHeading("Organization structure")
        listOf(
            "KILIVO LABS · Group",
            "KILIVO BUSINESS · Commerce & More",
            "KILIVO TECHNOLOGIES · Digital solutions",
            "KILIVO PROJECTS · Project delivery",
            "KILIVO IMPACT · Community programs"
        ).forEachIndexed { index, label ->
            Card(
                Modifier.fillMaxWidth().padding(start = if (index == 0) 0.dp else 18.dp),
                colors = CardDefaults.cardColors(containerColor = Color.White),
                border = androidx.compose.foundation.BorderStroke(1.dp, KilivoStroke),
                shape = RoundedCornerShape(14.dp)
            ) {
                Row(Modifier.fillMaxWidth().padding(14.dp), verticalAlignment = Alignment.CenterVertically) {
                    Icon(Icons.Filled.AccountTree, null, tint = KilivoBlue)
                    Text(label, Modifier.padding(start = 12.dp), color = KilivoInk, fontWeight = FontWeight.SemiBold)
                }
            }
        }
    }
}

@Composable
private fun DepartmentScreen(name: String, division: ComposeDivision) {
    Column(
        Modifier.fillMaxSize().verticalScroll(rememberScrollState()).padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(10.dp)
    ) {
        PreviewBanner()
        SectionHeading("My department / division")
        InfoPanel(Icons.Filled.Person, KilivoBlue, name, "Signed-in member · read-only")
        InfoPanel(division.icon, division.color, division.title, division.subtitle)
        Text("Department assignment and reporting lines will be provided by the member API.",
            color = KilivoMuted, fontSize = 13.sp)
    }
}

@Composable
private fun WorkspaceListScreen(
    title: String,
    subtitle: String,
    icon: ImageVector,
    records: List<ComposeWorkspaceRecord>,
    onSelect: ((ComposeWorkspaceRecord) -> Unit)? = null
) {
    LazyColumn(
        Modifier.fillMaxSize(),
        contentPadding = androidx.compose.foundation.layout.PaddingValues(15.dp),
        verticalArrangement = Arrangement.spacedBy(10.dp)
    ) {
        item {
            PreviewBanner()
            Text(title, Modifier.padding(top = 10.dp), color = KilivoInk, fontWeight = FontWeight.Bold, fontSize = 21.sp)
            Text(subtitle, color = KilivoMuted, fontSize = 13.sp)
        }
        items(records, key = { it.id }) { record ->
            Card(
                if (onSelect == null) Modifier.fillMaxWidth()
                else Modifier.fillMaxWidth().clickable { onSelect?.invoke(record) },
                colors = CardDefaults.cardColors(containerColor = Color.White),
                border = androidx.compose.foundation.BorderStroke(1.dp, KilivoStroke),
                shape = RoundedCornerShape(15.dp)
            ) {
                Row(Modifier.fillMaxWidth().padding(14.dp), verticalAlignment = Alignment.CenterVertically) {
                    IconBadge(icon, KilivoBlue, Color(0xFFE7EEFB), 46)
                    Column(Modifier.weight(1f).padding(start = 12.dp)) {
                        Text(record.title, color = KilivoInk, fontWeight = FontWeight.Bold)
                        Text(record.subtitle, color = KilivoMuted, fontSize = 12.sp)
                        Text("${record.status} · ${record.date}", color = KilivoBlue, fontSize = 11.sp)
                    }
                }
            }
        }
        if (records.isEmpty()) item { EmptyCard("No preview items are available.") }
    }
}

@Composable
private fun EventsScreen(events: List<ComposeWorkspaceRecord>, onSelect: (ComposeWorkspaceRecord) -> Unit) {
    LazyColumn(
        Modifier.fillMaxSize(),
        contentPadding = androidx.compose.foundation.layout.PaddingValues(15.dp),
        verticalArrangement = Arrangement.spacedBy(10.dp)
    ) {
        item { PreviewBanner(); SectionHeading("Meetings & events") }
        items(events, key = { it.id }) { event ->
            FeatureRow(
                ComposeFeature(event.title, "${event.date} · ${event.subtitle}", Icons.Filled.CalendarToday),
                KilivoBlue
            ) { onSelect(event) }
        }
    }
}

@Composable
private fun DocumentsScreen(documents: List<ComposeWorkspaceRecord>, onSelect: (ComposeWorkspaceRecord) -> Unit) {
    LazyColumn(
        Modifier.fillMaxSize(),
        contentPadding = androidx.compose.foundation.layout.PaddingValues(15.dp),
        verticalArrangement = Arrangement.spacedBy(10.dp)
    ) {
        item { PreviewBanner(); SectionHeading("Documents & resources") }
        items(documents, key = { it.id }) { document ->
            FeatureRow(
                ComposeFeature(document.title, "${document.subtitle} · ${document.date}", Icons.Filled.MenuBook),
                KilivoBlue
            ) { onSelect(document) }
        }
    }
}

@Composable
private fun WorkspaceDetailScreen(title: String, record: ComposeWorkspaceRecord, icon: ImageVector) {
    Column(
        Modifier.fillMaxSize().verticalScroll(rememberScrollState()).padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(12.dp)
    ) {
        PreviewBanner()
        InfoPanel(icon, KilivoBlue, record.title, record.subtitle)
        InfoPanel(Icons.Filled.CalendarToday, KilivoBlue, record.status, record.date)
        Text("$title · This is sample content. Secure API access and document/event actions are not connected.",
            color = KilivoMuted, fontSize = 13.sp)
    }
}

@Composable
private fun DocumentDetailScreen(record: ComposeWorkspaceRecord, onDownload: () -> Unit) {
    Column(
        Modifier.fillMaxSize().verticalScroll(rememberScrollState()).padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(12.dp)
    ) {
        PreviewBanner()
        InfoPanel(Icons.Filled.MenuBook, KilivoBlue, record.title, record.subtitle)
        InfoPanel(Icons.Filled.CalendarToday, KilivoBlue, record.status, record.date)
        Text("Document access will be checked against your member account.", color = KilivoMuted, fontSize = 13.sp)
        PrimaryComposeButton("Preview Secure Download", Modifier.fillMaxWidth(), onClick = onDownload)
    }
}

@Composable
private fun AnnouncementsScreen(updates: List<ComposeNews>, onSelect: (ComposeNews) -> Unit) {
    LazyColumn(
        Modifier.fillMaxSize(),
        contentPadding = androidx.compose.foundation.layout.PaddingValues(15.dp),
        verticalArrangement = Arrangement.spacedBy(10.dp)
    ) {
        item {
            PreviewBanner()
            Text("Official announcements", Modifier.padding(top = 10.dp), color = KilivoInk,
                fontWeight = FontWeight.Bold, fontSize = 21.sp)
            Text("Company notices for signed-in members. Internal chat is not included in this release.",
                color = KilivoMuted, fontSize = 13.sp)
        }
        items(updates) { announcement -> NewsCard(announcement) { onSelect(announcement) } }
    }
}

@Composable
private fun AnnouncementDetailScreen(item: ComposeNews) {
    Column(
        Modifier.fillMaxSize().verticalScroll(rememberScrollState()).padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(10.dp)
    ) {
        PreviewBanner()
        PhotoCard(item.image, 190, item.title)
        SectionHeading(item.title)
        Text(item.date, color = KilivoMuted, fontSize = 12.sp)
        Text(item.description, color = KilivoInk, fontSize = 15.sp, lineHeight = 22.sp)
        Text("Sample announcement · API not connected", color = KilivoMuted, fontSize = 12.sp)
    }
}

@Composable
private fun DonationCheckoutScreen(
    amount: String,
    program: String,
    paymentMethod: String,
    onPaymentMethod: (String) -> Unit,
    onContinue: () -> Unit
) {
    Column(
        Modifier.fillMaxSize().verticalScroll(rememberScrollState()).padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(12.dp)
    ) {
        PreviewBanner()
        SectionHeading("Review donation")
        InfoPanel(Icons.Filled.VolunteerActivism, Color(0xFFEF6700), amount, "Donation amount · TZS")
        InfoPanel(Icons.Filled.Favorite, Color(0xFFEF6700), "Donation program", program)
        Text("Choose a payment method", color = KilivoInk, fontWeight = FontWeight.Bold)
        listOf("Mobile money", "Bank card", "Bank transfer").forEach { method ->
            FilterPill(method, method == paymentMethod, Modifier.fillMaxWidth()) { onPaymentMethod(method) }
        }
        InfoPanel(Icons.Filled.Shield, KilivoBlue, "Secure checkout",
            "A payment provider will collect payment details on its secure checkout page. This preview does not accept or process payments.")
        PrimaryComposeButton("Continue to secure checkout", Modifier.fillMaxWidth(), onClick = onContinue)
    }
}

@Composable
private fun SplashScreen() {
    Box(Modifier.fillMaxSize()) {
        Image(painterResource(R.drawable.splash_family), null, Modifier.fillMaxSize(), contentScale = ContentScale.Crop)
        Box(Modifier.fillMaxSize().background(Color(0x66020F36)))
        Column(
            Modifier.align(Alignment.TopCenter).padding(top = 110.dp),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            Image(painterResource(R.drawable.ic_logo_mark), "KILIVO LABS logo", Modifier.size(86.dp))
            Text("KILIVO LABS", color = Color.White, fontSize = 29.sp, fontWeight = FontWeight.Bold)
            Text("Build. Innovate. Empower.", color = Color.White, fontSize = 14.sp, fontWeight = FontWeight.Bold)
        }
        Column(
            Modifier.align(Alignment.BottomCenter).padding(bottom = 42.dp),
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            CircularProgressIndicator(
                modifier = Modifier.size(34.dp),
                color = Color.White,
                strokeWidth = 3.dp
            )
            Text("Loading your world...", color = Color.White, fontSize = 13.sp)
        }
    }
}

@Composable
private fun WelcomeScreen(divisions: List<ComposeDivision>, onStart: () -> Unit) {
    Box(Modifier.fillMaxSize()) {
        Image(
            painterResource(R.drawable.background),
            contentDescription = null,
            modifier = Modifier.fillMaxSize(),
            contentScale = ContentScale.Crop
        )
        Column(
            Modifier.fillMaxSize().padding(horizontal = 18.dp, vertical = 18.dp),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            Text("Welcome to", fontSize = 25.sp, fontWeight = FontWeight.Bold, color = KilivoInk)
            Text("KILIVO LABS", fontSize = 34.sp, fontWeight = FontWeight.Bold, color = KilivoInk)
            Text("One Family. Four Unique Identities.", fontSize = 15.sp, fontWeight = FontWeight.Bold, color = KilivoInk)
            Text("A diversified enterprise group driving innovation, opportunity and social impact.",
                Modifier.padding(top = 8.dp, bottom = 16.dp), textAlign = TextAlign.Center, color = KilivoMuted)
            BoxWithConstraints(Modifier.fillMaxWidth().weight(1f)) {
                val tileHeight = minOf((maxHeight - 10.dp) / 2, (maxWidth - 10.dp) / 2)
                Column(
                    Modifier.align(Alignment.Center),
                    verticalArrangement = Arrangement.spacedBy(10.dp)
                ) {
                    divisions.chunked(2).forEach { row ->
                        Row(
                            Modifier.fillMaxWidth().height(tileHeight),
                            horizontalArrangement = Arrangement.spacedBy(10.dp)
                        ) {
                            row.forEach { division ->
                                WelcomeTile(division, Modifier.weight(1f).fillMaxHeight())
                            }
                        }
                    }
                }
            }
            Text("●  ○  ○  ○", Modifier.padding(vertical = 12.dp), color = KilivoBlue)
            PrimaryComposeButton("Get Started", Modifier.fillMaxWidth(), onClick = onStart)
        }
    }
}

@Composable
private fun WelcomeTile(division: ComposeDivision, modifier: Modifier = Modifier) {
    Card(
        modifier,
        shape = RoundedShieldShape,
        colors = CardDefaults.cardColors(containerColor = division.pale),
        elevation = CardDefaults.cardElevation(defaultElevation = 6.dp)
    ) {
        Column(Modifier.fillMaxSize().padding(8.dp), horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.Center) {
            Icon(division.icon, division.shortTitle, tint = division.color, modifier = Modifier.size(42.dp))
            Text(division.shortTitle.uppercase(), color = KilivoInk, fontWeight = FontWeight.Bold,
                fontSize = 13.sp, textAlign = TextAlign.Center)
        }
    }
}

@Composable
private fun HomeScreen(divisions: List<ComposeDivision>, onNavigate: (ComposeScreen, String) -> Unit) {
    LazyColumn(
        Modifier.fillMaxSize(),
        contentPadding = androidx.compose.foundation.layout.PaddingValues(15.dp),
        verticalArrangement = Arrangement.spacedBy(9.dp)
    ) {
        item { PreviewBanner() }
        item { PhotoCard(R.drawable.home_skyline, 205, "Together for a brighter future") }
        item { Text("Our Divisions", fontSize = 19.sp, color = KilivoInk, fontWeight = FontWeight.Bold, modifier = Modifier.padding(top = 6.dp)) }
        items(divisions.chunked(2)) { row ->
            Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                row.forEach { division ->
                    DivisionHomeCard(division, Modifier.weight(1f)) {
                        onNavigate(ComposeScreen.DivisionDetail, division.id)
                    }
                }
            }
        }
        item {
            Card(colors = CardDefaults.cardColors(containerColor = Color(0xFFCFDFFF)),
                shape = RoundedCornerShape(18.dp), elevation = CardDefaults.cardElevation(3.dp)) {
                Row(Modifier.fillMaxWidth().padding(12.dp), verticalAlignment = Alignment.CenterVertically) {
                    Icon(Icons.Filled.TrackChanges, null, tint = KilivoBlue, modifier = Modifier.size(40.dp))
                    Column(Modifier.weight(1f).padding(horizontal = 10.dp)) {
                        Text("Our Mission", fontWeight = FontWeight.Bold, color = KilivoInk, fontSize = 16.sp)
                        Text("Create opportunities, build solutions and make positive impact.", color = KilivoInk, fontSize = 12.sp)
                    }
                    TextButton(onClick = { onNavigate(ComposeScreen.About, "") }) { Text("Learn More") }
                }
            }
        }
        item { OfflineNote() }
    }
}

@Composable
private fun DivisionHomeCard(division: ComposeDivision, modifier: Modifier = Modifier, onClick: () -> Unit) {
    Card(
        modifier.fillMaxWidth().height(180.dp).clickable(onClick = onClick),
        shape = RoundedCornerShape(20.dp),
        colors = CardDefaults.cardColors(containerColor = division.pale),
        elevation = CardDefaults.cardElevation(defaultElevation = 5.dp)
    ) {
        Box(Modifier.fillMaxSize().padding(12.dp)) {
            Column(Modifier.align(Alignment.Center), horizontalAlignment = Alignment.CenterHorizontally) {
                Icon(division.icon, null, tint = division.color, modifier = Modifier.size(42.dp))
                Text("KILIVO", fontWeight = FontWeight.Bold, color = KilivoInk, fontSize = 13.sp)
                Text(division.shortTitle.uppercase(), fontWeight = FontWeight.Bold, color = KilivoInk, fontSize = 16.sp)
                Text(division.subtitle, color = KilivoInk, fontSize = 11.sp, textAlign = TextAlign.Center, maxLines = 1)
            }
            Icon(Icons.Filled.ArrowForward, null, tint = Color.White,
                modifier = Modifier.align(Alignment.BottomEnd).clip(CircleShape).background(division.color).padding(5.dp).size(23.dp))
        }
    }
}

@Composable
private fun DivisionsScreen(divisions: List<ComposeDivision>, onSelect: (ComposeDivision) -> Unit) {
    LazyColumn(Modifier.fillMaxSize(), contentPadding = androidx.compose.foundation.layout.PaddingValues(15.dp),
        verticalArrangement = Arrangement.spacedBy(12.dp)) {
        item {
            PreviewBanner()
            Text("One Family. Four Unique Identities.", fontSize = 20.sp, fontWeight = FontWeight.Bold, color = KilivoInk)
            Text("Discover the teams creating opportunity, innovation and positive impact.",
                Modifier.padding(top = 4.dp, bottom = 5.dp), color = KilivoMuted, fontSize = 13.sp)
        }
        items(divisions) { division -> DivisionListCard(division, onClick = { onSelect(division) }) }
        item { OfflineNote() }
    }
}

@Composable
private fun DivisionListCard(division: ComposeDivision, onClick: () -> Unit) {
    Card(
        Modifier.fillMaxWidth().clickable(onClick = onClick),
        shape = RoundedCornerShape(19.dp),
        colors = CardDefaults.cardColors(containerColor = division.pale),
        elevation = CardDefaults.cardElevation(5.dp)
    ) {
        Row(Modifier.fillMaxWidth().padding(15.dp), verticalAlignment = Alignment.CenterVertically) {
            IconBadge(division.icon, division.color, Color.White, 60)
            Column(Modifier.weight(1f).padding(horizontal = 12.dp)) {
                Text(division.title, fontSize = 16.sp, fontWeight = FontWeight.Bold, color = KilivoInk)
                Text(division.subtitle, color = division.color, fontWeight = FontWeight.Bold, fontSize = 13.sp)
                Text(division.description, color = KilivoMuted, fontSize = 12.sp, maxLines = 2)
            }
            RoundArrow(division.color)
        }
    }
}

@Composable
private fun DivisionDetailScreen(
    division: ComposeDivision,
    onInterest: (String) -> Unit,
    onDonate: () -> Unit
) {
    LazyColumn(Modifier.fillMaxSize(), contentPadding = androidx.compose.foundation.layout.PaddingValues(15.dp),
        verticalArrangement = Arrangement.spacedBy(10.dp)) {
        item { PreviewBanner() }
        item { PhotoCard(division.image, 196, division.title) }
        item {
            Card(colors = CardDefaults.cardColors(containerColor = Color.White),
                shape = RoundedCornerShape(20.dp), elevation = CardDefaults.cardElevation(4.dp)) {
                Row(Modifier.fillMaxWidth().padding(14.dp), verticalAlignment = Alignment.CenterVertically) {
                    IconBadge(division.icon, division.color, division.pale, 60)
                    Column(Modifier.weight(1f).padding(start = 11.dp)) {
                        Text(division.title, fontSize = 17.sp, fontWeight = FontWeight.Bold, color = KilivoInk)
                        Text(division.subtitle, color = division.color, fontWeight = FontWeight.Bold)
                        Text(division.description, color = KilivoInk, fontSize = 12.sp)
                    }
                }
            }
        }
        if (division.id == "business") {
            item { InfoPanel(Icons.Filled.TrackChanges, division.color, "Our Vision", "To be a leading diversified business group in Africa.") }
        }
        item { SectionHeading(division.section) }
        items(division.features) { feature ->
            FeatureRow(feature, division.color) { onInterest(feature.title) }
        }
        item {
            val label = when (division.id) {
                "business" -> "Explore More"
                "technology" -> "Explore Our Tech"
                "projects" -> "Explore Projects"
                else -> "Join Our Impact"
            }
            PrimaryComposeButton(label, Modifier.fillMaxWidth()) {
                if (division.id == "impact") onDonate() else onInterest("$label enquiry")
            }
        }
        item { OfflineNote() }
    }
}

@Composable
private fun UpdatesScreen(
    updates: List<ComposeNews>,
    filter: String,
    onFilter: (String) -> Unit,
    onSelect: (ComposeNews) -> Unit
) {
    val filtered = updates.filter { filter == "All" || it.category == filter }
    LazyColumn(Modifier.fillMaxSize(), contentPadding = androidx.compose.foundation.layout.PaddingValues(15.dp),
        verticalArrangement = Arrangement.spacedBy(10.dp)) {
        item {
            PreviewBanner()
            Text("Stories from across KILIVO LABS", fontSize = 20.sp, color = KilivoInk, fontWeight = FontWeight.Bold)
            Text("Explore technology, community and project updates.",
                color = KilivoMuted, fontSize = 13.sp, modifier = Modifier.padding(top = 4.dp, bottom = 8.dp))
            Row(horizontalArrangement = Arrangement.spacedBy(5.dp)) {
                listOf("All", "Technology", "Impact", "Projects").forEach { category ->
                    FilterPill(category, category == filter, Modifier.weight(1f)) { onFilter(category) }
                }
            }
        }
        item { SectionHeading("Latest updates", "${filtered.size} saved") }
        items(filtered) { item -> NewsCard(item, onClick = { onSelect(item) }) }
        item { OfflineNote() }
    }
}

@Composable
private fun SearchScreen(
    divisions: List<ComposeDivision>,
    updates: List<ComposeNews>,
    announcements: List<ComposeNews>,
    projects: List<ComposeWorkspaceRecord>,
    query: String,
    onQueryChange: (String) -> Unit,
    onDivision: (ComposeDivision) -> Unit,
    onUpdate: (ComposeNews) -> Unit,
    onProject: () -> Unit
) {
    val matches = remember(query, divisions, updates) {
        if (query.isBlank()) emptyList()
        else buildList {
            divisions.forEach { division ->
                if ("${division.title} ${division.shortTitle} ${division.subtitle} ${division.description}"
                        .contains(query, ignoreCase = true)) add(division to null)
                division.features.filter {
                    "${it.title} ${it.subtitle} ${division.title}".contains(query, ignoreCase = true)
                }.forEach { add(division to it.title) }
            }
        }
    }
    val newsMatches = remember(query, updates) {
        if (query.isBlank()) emptyList()
        else updates.filter { "${it.title} ${it.category} ${it.description}".contains(query, ignoreCase = true) }
    }
    val announcementMatches = remember(query, announcements) {
        if (query.isBlank()) emptyList()
        else announcements.filter { "${it.title} ${it.category} ${it.description}".contains(query, ignoreCase = true) }
    }
    val projectMatches = remember(query, projects) {
        if (query.isBlank()) emptyList()
        else projects.filter { "${it.title} ${it.subtitle} ${it.status}".contains(query, ignoreCase = true) }
    }
    LazyColumn(Modifier.fillMaxSize(), contentPadding = androidx.compose.foundation.layout.PaddingValues(15.dp),
        verticalArrangement = Arrangement.spacedBy(9.dp)) {
        item {
            PreviewBanner()
            Text("Find what you need", fontSize = 20.sp, color = KilivoInk, fontWeight = FontWeight.Bold)
            Text("Search divisions, services, projects, updates and announcements.", color = KilivoMuted, fontSize = 13.sp)
            OutlinedTextField(
                value = query,
                onValueChange = onQueryChange,
                modifier = Modifier.fillMaxWidth().padding(top = 10.dp),
                singleLine = true,
                leadingIcon = { Icon(Icons.Filled.Search, null, tint = KilivoBlue) },
                placeholder = { Text("Search divisions, services, updates...") },
                shape = RoundedCornerShape(15.dp)
            )
            Text(
                if (query.isBlank()) "Start typing to search"
                else "${matches.size + newsMatches.size + announcementMatches.size + projectMatches.size} results",
                Modifier.padding(top = 10.dp), color = KilivoMuted, fontWeight = FontWeight.Bold
            )
        }
        if (query.isBlank()) {
            item { EmptyCard("Search by division name, service, project or update.") }
        } else if (matches.isEmpty() && newsMatches.isEmpty() && announcementMatches.isEmpty() && projectMatches.isEmpty()) {
            item { EmptyCard("No saved offline results for \"$query\".") }
        }
        items(matches) { (division, feature) ->
            FeatureRow(
                ComposeFeature(feature ?: division.title, if (feature == null) division.subtitle else "Service · ${division.shortTitle}", division.icon),
                division.color
            ) { onDivision(division) }
        }
        items(newsMatches) { NewsCard(it) { onUpdate(it) } }
        items(announcementMatches) { NewsCard(it) { onUpdate(it) } }
        items(projectMatches, key = { "search-${it.id}" }) { project ->
            FeatureRow(ComposeFeature(project.title, project.subtitle, Icons.Filled.Folder), KilivoBlue, onProject)
        }
    }
}

@Composable
private fun UpdateDetailScreen(item: ComposeNews) {
    LazyColumn(Modifier.fillMaxSize(), contentPadding = androidx.compose.foundation.layout.PaddingValues(15.dp),
        verticalArrangement = Arrangement.spacedBy(8.dp)) {
        item { PhotoCard(item.image, 220, item.title) }
        item { Text(item.category.uppercase(), color = KilivoBlue, fontWeight = FontWeight.Bold, modifier = Modifier.padding(top = 8.dp)) }
        item { Text(item.title, fontSize = 24.sp, color = KilivoInk, fontWeight = FontWeight.Bold) }
        item { Text(item.date, color = KilivoMuted) }
        item { Text(item.description, color = KilivoInk, fontSize = 16.sp, lineHeight = 24.sp, modifier = Modifier.padding(vertical = 8.dp)) }
        item { InfoPanel(Icons.Filled.CalendarToday, KilivoBlue, "Offline article", "This update is saved in the app and can be read without internet.") }
    }
}

@Composable
private fun ProfileScreen(name: String, email: String, imageUri: String?, onAction: (String) -> Unit) {
    LazyColumn(Modifier.fillMaxSize(), contentPadding = androidx.compose.foundation.layout.PaddingValues(horizontal = 15.dp, vertical = 9.dp),
        verticalArrangement = Arrangement.spacedBy(9.dp)) {
        item {
            Card(colors = CardDefaults.cardColors(containerColor = Color.White), shape = RoundedCornerShape(19.dp),
                border = androidx.compose.foundation.BorderStroke(1.dp, KilivoStroke)) {
                Row(Modifier.fillMaxWidth().padding(16.dp), verticalAlignment = Alignment.CenterVertically) {
                    ProfileAvatar(imageUri, 62)
                    Column(Modifier.weight(1f).padding(horizontal = 12.dp)) {
                        Text(name, fontSize = 18.sp, fontWeight = FontWeight.Bold, color = KilivoInk)
                        Text("KILIVO LABS Member", color = KilivoMuted, fontSize = 13.sp)
                        if (email.isNotBlank()) Text(email, color = KilivoMuted, fontSize = 12.sp)
                    }
                }
            }
        }
        items(listOf(
            Icons.Filled.Favorite to "My Donations",
            Icons.Filled.TrackChanges to "My Interests",
            Icons.Filled.TrackChanges to "About KILIVO LABS",
            Icons.Filled.Help to "Help & Support",
            Icons.Filled.Shield to "Privacy & Security"
        )) { (icon, title) ->
            Card(colors = CardDefaults.cardColors(containerColor = Color.White), shape = RoundedCornerShape(14.dp),
                border = androidx.compose.foundation.BorderStroke(1.dp, KilivoStroke)) {
                Row(Modifier.fillMaxWidth().clickable { onAction(title) }.padding(horizontal = 14.dp, vertical = 17.dp),
                    verticalAlignment = Alignment.CenterVertically) {
                    Icon(icon, null, tint = KilivoBlue, modifier = Modifier.size(28.dp))
                    Text(title, Modifier.weight(1f).padding(start = 12.dp), color = KilivoInk, fontSize = 16.sp, fontWeight = FontWeight.SemiBold)
                    Icon(Icons.Filled.ArrowForward, null, tint = KilivoBlue, modifier = Modifier.padding(start = 7.dp))
                }
            }
        }
        item {
            Image(
                painterResource(R.drawable.settings_landscape),
                "Together, we create a better tomorrow.",
                Modifier.fillMaxWidth().height(280.dp).clip(RoundedCornerShape(20.dp)),
                contentScale = ContentScale.FillBounds
            )
        }
    }
}

@Composable
private fun EditAccountScreen(
    displayName: String,
    email: String,
    imageUri: String?,
    onPickImage: () -> Unit,
    onSave: (String, String, Boolean) -> Unit
) {
    var editedName by remember(displayName) { mutableStateOf(displayName) }
    var editedEmail by remember(email) { mutableStateOf(email) }
    var currentPassword by remember { mutableStateOf("") }
    var newPassword by remember { mutableStateOf("") }
    var confirmPassword by remember { mutableStateOf("") }
    var showCurrentPassword by remember { mutableStateOf(false) }
    var showNewPassword by remember { mutableStateOf(false) }
    var showConfirmPassword by remember { mutableStateOf(false) }
    var validationMessage by remember { mutableStateOf<String?>(null) }

    Column(
        Modifier.fillMaxSize().verticalScroll(rememberScrollState()).padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(12.dp)
    ) {
        Card(
            colors = CardDefaults.cardColors(containerColor = Color.White),
            shape = RoundedCornerShape(19.dp),
            border = androidx.compose.foundation.BorderStroke(1.dp, KilivoStroke)
        ) {
            Column(
                Modifier.fillMaxWidth().padding(18.dp),
                horizontalAlignment = Alignment.CenterHorizontally,
                verticalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                Box(contentAlignment = Alignment.BottomEnd) {
                    Box(Modifier.clickable(onClick = onPickImage)) {
                        ProfileAvatar(imageUri, 88)
                    }
                    Icon(
                        Icons.Filled.CameraAlt,
                        contentDescription = "Choose profile photo",
                        tint = Color.White,
                        modifier = Modifier.size(27.dp).clip(CircleShape).background(KilivoBlue)
                            .clickable(onClick = onPickImage).padding(5.dp)
                    )
                }
                Text("Tap your photo to change it", color = KilivoBlue, fontSize = 13.sp)
            }
        }

        Text("PROFILE DETAILS", color = KilivoMuted, fontWeight = FontWeight.Bold, fontSize = 12.sp)
        OutlinedTextField(
            value = editedName,
            onValueChange = { editedName = it; validationMessage = null },
            label = { Text("Display name") },
            singleLine = true,
            modifier = Modifier.fillMaxWidth()
        )
        OutlinedTextField(
            value = editedEmail,
            onValueChange = { editedEmail = it; validationMessage = null },
            label = { Text("Username / Email") },
            keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Email),
            singleLine = true,
            modifier = Modifier.fillMaxWidth()
        )

        Text("CHANGE PASSWORD", color = KilivoMuted, fontWeight = FontWeight.Bold, fontSize = 12.sp)
        Text(
            "Leave these fields blank if you do not want to change your password.",
            color = KilivoMuted,
            fontSize = 13.sp
        )
        OutlinedTextField(
            value = currentPassword,
            onValueChange = { currentPassword = it; validationMessage = null },
            label = { Text("Current password") },
            visualTransformation = if (showCurrentPassword) VisualTransformation.None else PasswordVisualTransformation(),
            trailingIcon = {
                IconButton(onClick = { showCurrentPassword = !showCurrentPassword }) {
                    Icon(
                        if (showCurrentPassword) Icons.Filled.VisibilityOff else Icons.Filled.Visibility,
                        contentDescription = if (showCurrentPassword) "Hide current password" else "Show current password"
                    )
                }
            },
            singleLine = true,
            modifier = Modifier.fillMaxWidth()
        )
        OutlinedTextField(
            value = newPassword,
            onValueChange = { newPassword = it; validationMessage = null },
            label = { Text("New password") },
            visualTransformation = if (showNewPassword) VisualTransformation.None else PasswordVisualTransformation(),
            trailingIcon = {
                IconButton(onClick = { showNewPassword = !showNewPassword }) {
                    Icon(
                        if (showNewPassword) Icons.Filled.VisibilityOff else Icons.Filled.Visibility,
                        contentDescription = if (showNewPassword) "Hide new password" else "Show new password"
                    )
                }
            },
            singleLine = true,
            modifier = Modifier.fillMaxWidth()
        )
        OutlinedTextField(
            value = confirmPassword,
            onValueChange = { confirmPassword = it; validationMessage = null },
            label = { Text("Confirm new password") },
            visualTransformation = if (showConfirmPassword) VisualTransformation.None else PasswordVisualTransformation(),
            trailingIcon = {
                IconButton(onClick = { showConfirmPassword = !showConfirmPassword }) {
                    Icon(
                        if (showConfirmPassword) Icons.Filled.VisibilityOff else Icons.Filled.Visibility,
                        contentDescription = if (showConfirmPassword) "Hide confirmed password" else "Show confirmed password"
                    )
                }
            },
            singleLine = true,
            modifier = Modifier.fillMaxWidth()
        )

        validationMessage?.let { Text(it, color = Color(0xFFB3261E), fontSize = 13.sp) }
        Text(
            "Preview only: profile details are saved on this device. Password changes are not sent to a server or stored.",
            color = KilivoMuted,
            fontSize = 12.sp
        )
        Button(
            onClick = {
                val passwordFields = listOf(currentPassword, newPassword, confirmPassword)
                val changingPassword = passwordFields.any { it.isNotBlank() }
                validationMessage = when {
                    editedName.isBlank() -> "Enter a display name."
                    !android.util.Patterns.EMAIL_ADDRESS.matcher(editedEmail.trim()).matches() ->
                        "Enter a valid email address."
                    changingPassword && passwordFields.any { it.isBlank() } ->
                        "Complete all password fields to change your password."
                    changingPassword && newPassword.length < 8 ->
                        "The new password must be at least 8 characters."
                    changingPassword && newPassword != confirmPassword ->
                        "The new passwords do not match."
                    else -> null
                }
                if (validationMessage == null) {
                    onSave(editedName.trim(), editedEmail.trim(), changingPassword)
                    currentPassword = ""
                    newPassword = ""
                    confirmPassword = ""
                }
            },
            modifier = Modifier.fillMaxWidth()
        ) {
            Text("Save account changes")
        }
        Spacer(Modifier.height(8.dp))
    }
}

@Composable
private fun ProfileAvatar(imageUri: String?, size: Int) {
    val context = LocalContext.current
    var bitmap by remember(imageUri) { mutableStateOf<Bitmap?>(null) }
    var imageLoadFailed by remember(imageUri) { mutableStateOf(false) }

    LaunchedEffect(imageUri) {
        bitmap = null
        imageLoadFailed = false
        if (imageUri != null) {
            val loadedBitmap = withContext(Dispatchers.IO) {
                try {
                    context.contentResolver.openInputStream(Uri.parse(imageUri))
                        ?.use(BitmapFactory::decodeStream)
                } catch (_: java.io.IOException) {
                    null
                } catch (_: SecurityException) {
                    null
                }
            }
            bitmap = loadedBitmap
            imageLoadFailed = loadedBitmap == null
        }
    }

    Column(horizontalAlignment = Alignment.CenterHorizontally) {
        Box(
            Modifier.size(size.dp).clip(CircleShape).background(Color(0xFFE7EEFB)),
            contentAlignment = Alignment.Center
        ) {
            val image = bitmap
            if (image != null) {
                Image(
                    image.asImageBitmap(),
                    contentDescription = "Profile photo",
                    modifier = Modifier.fillMaxSize(),
                    contentScale = ContentScale.Crop
                )
            } else {
                Icon(
                    Icons.Filled.Person,
                    contentDescription = "Profile photo",
                    tint = KilivoBlue,
                    modifier = Modifier.size((size * 0.62f).dp)
                )
            }
        }
        if (imageLoadFailed) {
            Text("Could not load photo", color = Color(0xFFB3261E), fontSize = 10.sp)
        }
    }
}

@Composable
private fun PreferencesScreen(prefs: android.content.SharedPreferences) {
    var showUpdates by remember { mutableStateOf(prefs.getBoolean("pref_updates", true)) }
    var rememberWelcome by remember { mutableStateOf(prefs.getBoolean("onboarding_complete", true)) }
    Column(Modifier.fillMaxSize().padding(16.dp), verticalArrangement = Arrangement.spacedBy(10.dp)) {
        Text("Preferences are saved on this device.", color = KilivoMuted)
        PreferenceToggle("Keep me informed", "Show local app updates", showUpdates) {
            showUpdates = it
            prefs.edit().putBoolean("pref_updates", it).apply()
        }
        PreferenceToggle("Remember welcome screen", "Open Home after splash on next launch", rememberWelcome) {
            rememberWelcome = it
            prefs.edit().putBoolean("onboarding_complete", it).apply()
        }
        InfoPanel(Icons.Filled.Shield, KilivoBlue, "Offline mode", "This app does not connect to a server. Forms and pledges are saved only on this device.")
    }
}

@Composable
private fun AboutScreen(divisions: List<ComposeDivision>, onSelect: (ComposeDivision) -> Unit) {
    LazyColumn(Modifier.fillMaxSize(), contentPadding = androidx.compose.foundation.layout.PaddingValues(16.dp),
        verticalArrangement = Arrangement.spacedBy(10.dp)) {
        item { PhotoCard(R.drawable.home_skyline, 160, "KILIVO LABS") }
        item { Text("KILIVO LABS", fontSize = 26.sp, color = KilivoNavy, fontWeight = FontWeight.Bold) }
        item { Text("One family. Four unique identities. A diversified enterprise group driving innovation, opportunity and social impact.", color = KilivoInk, fontSize = 15.sp) }
        item { InfoPanel(Icons.Filled.TrackChanges, KilivoBlue, "Our Mission", "Create opportunities, build solutions and make positive impact.") }
        items(divisions) { DivisionListCard(it) { onSelect(it) } }
    }
}

@Composable
private fun HelpScreen() {
    Column(Modifier.fillMaxSize().padding(16.dp), verticalArrangement = Arrangement.spacedBy(10.dp)) {
        PreviewBanner()
        InfoPanel(Icons.Filled.Help, KilivoBlue, "What can I do in this offline version?",
            "Preview company divisions, member workspace screens, announcements, donation checkout, and submit a sample interest. Company profile details are read-only.")
        InfoPanel(Icons.Filled.Favorite, KilivoBlue, "Are donations processed?",
            "No. This preview does not open a payment provider, collect payment details, or record a donation.")
        InfoPanel(Icons.Filled.Shield, KilivoBlue, "Will my information sync?",
            "No. This UI preview does not send data to a server.")
    }
}

@Composable
private fun PrivacyScreen(onClear: () -> Unit) {
    Column(Modifier.fillMaxSize().padding(16.dp), verticalArrangement = Arrangement.spacedBy(10.dp)) {
        PreviewBanner()
        InfoPanel(Icons.Filled.Shield, KilivoBlue, "Stored on this device",
            "Profile display data and preferences are local preview values. Interests entered in this preview are stored on this device only.")
        InfoPanel(Icons.Filled.Shield, KilivoBlue, "No API connection",
            "Screens show sample content. No member, payment, document, or notification data is requested from a server.")
        Button(onClick = onClear, colors = ButtonDefaults.buttonColors(containerColor = Color(0xFFC42C3C)),
            modifier = Modifier.fillMaxWidth()) { Text("Clear Local App Data") }
    }
}

@Composable
private fun NotificationsScreen(
    notifications: List<ComposeNotice>,
    onRead: (ComposeNotice) -> Unit
) {
    LazyColumn(Modifier.fillMaxSize(), contentPadding = androidx.compose.foundation.layout.PaddingValues(15.dp),
        verticalArrangement = Arrangement.spacedBy(10.dp)) {
        item {
            PreviewBanner()
            SectionHeading("Notifications", "${notifications.count { !it.isRead }} unread")
        }
        if (notifications.isEmpty()) {
            item { EmptyCard("You're all caught up. New member notifications will appear here.") }
        }
        items(notifications, key = { it.id }) { notification ->
            Card(
                colors = CardDefaults.cardColors(containerColor = if (notification.isRead) Color.White else Color(0xFFEAF1FF)),
                border = androidx.compose.foundation.BorderStroke(1.dp, KilivoStroke),
                shape = RoundedCornerShape(15.dp)
            ) {
                Column(Modifier.fillMaxWidth().padding(14.dp)) {
                    Text(notification.title, color = KilivoInk, fontWeight = FontWeight.Bold)
                    Text(notification.message, Modifier.padding(top = 5.dp), color = KilivoMuted, fontSize = 13.sp)
                    Row(Modifier.fillMaxWidth().padding(top = 8.dp), verticalAlignment = Alignment.CenterVertically) {
                        Text(notification.date, Modifier.weight(1f), color = KilivoMuted, fontSize = 11.sp)
                        if (!notification.isRead) {
                            TextButton(onClick = { onRead(notification) }) { Text("Mark as read") }
                        } else {
                            Text("Read", color = KilivoBlue, fontSize = 12.sp)
                        }
                    }
                }
            }
        }
    }
}

@Composable
private fun DonationScreen(
    amount: String,
    onAmount: (String) -> Unit,
    program: String,
    onProgram: (String) -> Unit,
    onOtherAmount: () -> Unit,
    onSave: () -> Unit
) {
    Column(Modifier.fillMaxSize().padding(16.dp), verticalArrangement = Arrangement.spacedBy(12.dp)) {
        PreviewBanner()
        InfoPanel(Icons.Filled.VolunteerActivism, Color(0xFFEF6700), "Your Support Changes Lives",
            "Choose a program and amount, then review the secure payment checkout.")
        SectionHeading("Choose a program")
        listOf("Community Development", "Youth Empowerment", "Education & Awareness", "Humanitarian Support")
            .chunked(2).forEach { row ->
                Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                    row.forEach { option ->
                        FilterPill(option, option == program, Modifier.weight(1f)) { onProgram(option) }
                    }
                }
            }
        SectionHeading("Choose Amount")
        listOf("TZS 5,000", "TZS 10,000", "TZS 20,000", "Other Amount").chunked(2).forEach { row ->
            Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                row.forEach { choice ->
                    FilterPill(choice, choice == amount, Modifier.weight(1f)) {
                        if (choice == "Other Amount") onOtherAmount() else onAmount(choice)
                    }
                }
            }
        }
        InfoPanel(Icons.Filled.Shield, KilivoBlue, "Secure payment",
            "Payment details will be entered on the provider's secure checkout page. This UI preview does not start a payment.")
        PrimaryComposeButton("Review Donation", Modifier.fillMaxWidth(), onClick = onSave)
    }
}

@Composable
private fun DonationHistoryScreen(donations: List<ComposeWorkspaceRecord>) {
    LazyColumn(
        Modifier.fillMaxSize(),
        contentPadding = androidx.compose.foundation.layout.PaddingValues(15.dp),
        verticalArrangement = Arrangement.spacedBy(10.dp)
    ) {
        item {
            PreviewBanner()
            Text("My Donations", Modifier.padding(top = 10.dp), color = KilivoInk,
                fontSize = 21.sp, fontWeight = FontWeight.Bold)
            Text("Donation history and payment status from the member account.",
                color = KilivoMuted, fontSize = 13.sp)
        }
        items(donations, key = { it.id }) { donation ->
            val statusColor = when (donation.status.lowercase()) {
                "succeeded" -> Color(0xFF16825D)
                "pending" -> Color(0xFFB36B00)
                "refunded" -> Color(0xFF52658E)
                else -> Color(0xFFB3261E)
            }
            Card(
                colors = CardDefaults.cardColors(containerColor = Color.White),
                border = androidx.compose.foundation.BorderStroke(1.dp, KilivoStroke),
                shape = RoundedCornerShape(15.dp)
            ) {
                Row(Modifier.fillMaxWidth().padding(14.dp), verticalAlignment = Alignment.CenterVertically) {
                    IconBadge(Icons.Filled.VolunteerActivism, statusColor, Color(0xFFEAF1FF), 46)
                    Column(Modifier.weight(1f).padding(start = 12.dp)) {
                        Text(donation.title, color = KilivoInk, fontWeight = FontWeight.Bold)
                        Text(donation.subtitle, color = KilivoMuted, fontSize = 12.sp)
                        Text(donation.date, color = KilivoMuted, fontSize = 11.sp)
                    }
                    Text(
                        donation.status,
                        color = statusColor,
                        fontWeight = FontWeight.Bold,
                        fontSize = 11.sp,
                        modifier = Modifier.background(statusColor.copy(alpha = 0.1f), CircleShape)
                            .padding(horizontal = 9.dp, vertical = 5.dp)
                    )
                }
            }
        }
        if (donations.isEmpty()) {
            item { EmptyCard("No donation records are available.") }
        }
    }
}

@Composable
private fun SavedListScreen(title: String, items: List<String>, emptyTitle: String, emptyBody: String) {
    LazyColumn(Modifier.fillMaxSize(), contentPadding = androidx.compose.foundation.layout.PaddingValues(15.dp),
        verticalArrangement = Arrangement.spacedBy(8.dp)) {
        item { PreviewBanner(); SectionHeading(title) }
        if (items.isEmpty()) {
            item { InfoPanel(Icons.Filled.Favorite, KilivoBlue, emptyTitle, emptyBody) }
        } else {
            items(items) { value ->
                val parts = value.split("|", limit = 5)
                Card(colors = CardDefaults.cardColors(containerColor = Color.White),
                    border = androidx.compose.foundation.BorderStroke(1.dp, KilivoStroke)) {
                    Column(Modifier.fillMaxWidth().padding(14.dp)) {
                        Text(parts.getOrElse(1) { title }, color = KilivoInk, fontWeight = FontWeight.Bold, fontSize = 16.sp)
                        Text(parts.drop(2).joinToString(" · "), color = KilivoMuted, fontSize = 12.sp)
                    }
                }
            }
        }
    }
}

@Composable
private fun NewsCard(item: ComposeNews, onClick: () -> Unit) {
    val categoryColor = categoryColor(item.category)
    Card(
        Modifier.fillMaxWidth().clickable(onClick = onClick),
        colors = CardDefaults.cardColors(containerColor = Color.White),
        shape = RoundedCornerShape(18.dp),
        border = androidx.compose.foundation.BorderStroke(1.dp, categoryColor.copy(alpha = 0.45f)),
        elevation = CardDefaults.cardElevation(3.dp)
    ) {
        Row(Modifier.padding(9.dp), verticalAlignment = Alignment.CenterVertically) {
            Image(painterResource(item.image), null, Modifier.size(96.dp).clip(RoundedCornerShape(13.dp)), contentScale = ContentScale.Crop)
            Column(Modifier.weight(1f).padding(horizontal = 11.dp)) {
                Text(item.category.uppercase(), color = categoryColor, fontSize = 10.sp, fontWeight = FontWeight.Bold)
                Text(item.title, color = KilivoInk, fontSize = 14.sp, fontWeight = FontWeight.Bold, maxLines = 2)
                Text(item.date, color = KilivoMuted, fontSize = 11.sp, modifier = Modifier.padding(top = 3.dp))
                Text(item.description, color = KilivoMuted, fontSize = 11.sp, maxLines = 2,
                    modifier = Modifier.padding(top = 4.dp))
            }
            RoundArrow(categoryColor)
        }
    }
}

@Composable
private fun FeatureRow(feature: ComposeFeature, tint: Color, onClick: () -> Unit) {
    Card(
        Modifier.fillMaxWidth().clickable(onClick = onClick),
        colors = CardDefaults.cardColors(containerColor = Color.White),
        shape = RoundedCornerShape(16.dp),
        border = androidx.compose.foundation.BorderStroke(1.dp, KilivoStroke)
    ) {
        Row(Modifier.fillMaxWidth().padding(12.dp), verticalAlignment = Alignment.CenterVertically) {
            IconBadge(feature.icon, tint, Color(0xFFEFF4FF), 48)
            Column(Modifier.weight(1f).padding(horizontal = 10.dp)) {
                Text(feature.title, color = KilivoInk, fontWeight = FontWeight.Bold, fontSize = 14.sp)
                Text(feature.subtitle, color = KilivoMuted, fontSize = 12.sp, maxLines = 2)
            }
            Icon(Icons.Filled.ArrowForward, null, tint = tint)
        }
    }
}

@Composable
private fun InfoPanel(icon: ImageVector, tint: Color, title: String, description: String) {
    Card(colors = CardDefaults.cardColors(containerColor = Color(0xFFE5EFFF)),
        shape = RoundedCornerShape(16.dp)) {
        Row(Modifier.fillMaxWidth().padding(12.dp), verticalAlignment = Alignment.CenterVertically) {
            Icon(icon, null, tint = tint, modifier = Modifier.size(40.dp))
            Column(Modifier.padding(start = 10.dp)) {
                Text(title, color = KilivoInk, fontWeight = FontWeight.Bold, fontSize = 14.sp)
                Text(description, color = KilivoInk, fontSize = 12.sp)
            }
        }
    }
}

@Composable
private fun SectionHeading(title: String, action: String? = null) {
    Row(Modifier.fillMaxWidth().padding(vertical = 5.dp), verticalAlignment = Alignment.CenterVertically) {
        Text(title, Modifier.weight(1f), fontSize = 17.sp, fontWeight = FontWeight.Bold, color = KilivoInk)
        if (action != null) Text(action, color = KilivoBlue, fontWeight = FontWeight.Bold, fontSize = 12.sp)
    }
}

@Composable
private fun FilterPill(text: String, selected: Boolean, modifier: Modifier = Modifier, onClick: () -> Unit) {
    Surface(
        modifier = modifier.height(42.dp).clickable(onClick = onClick),
        shape = CircleShape,
        color = if (selected) KilivoBlue else Color(0xFFEDF1FA)
    ) {
        Box(contentAlignment = Alignment.Center) {
            Text(text, color = if (selected) Color.White else KilivoInk, fontSize = 11.sp, fontWeight = FontWeight.Bold,
                maxLines = 1, overflow = TextOverflow.Ellipsis)
        }
    }
}

@Composable
private fun PrimaryComposeButton(
    text: String,
    modifier: Modifier = Modifier,
    enabled: Boolean = true,
    onClick: () -> Unit
) {
    Button(onClick = onClick, modifier = modifier.height(52.dp), enabled = enabled,
        colors = ButtonDefaults.buttonColors(containerColor = KilivoBlue),
        shape = RoundedCornerShape(50)) {
        Text(text, color = Color.White, fontWeight = FontWeight.Bold, fontSize = 15.sp)
        Icon(Icons.Filled.ArrowForward, null, tint = Color.White, modifier = Modifier.padding(start = 6.dp).size(18.dp))
    }
}

@Composable
private fun PhotoCard(resource: Int, height: Int, description: String, modifier: Modifier = Modifier) {
    val imageModifier = if (height > 0) modifier.fillMaxWidth().height(height.dp) else modifier
    Image(
        painterResource(resource), description, imageModifier.clip(RoundedCornerShape(20.dp)),
        contentScale = ContentScale.Crop
    )
}

@Composable
private fun IconBadge(icon: ImageVector, tint: Color, background: Color, size: Int) {
    Box(Modifier.size(size.dp).clip(RoundedCornerShape(16.dp)).background(background),
        contentAlignment = Alignment.Center) {
        Icon(icon, null, tint = tint, modifier = Modifier.size(size.dp * 0.75f))
    }
}

@Composable
private fun RoundArrow(color: Color) {
    Box(Modifier.size(38.dp).clip(CircleShape).background(color), contentAlignment = Alignment.Center) {
        Icon(Icons.Filled.ArrowForward, null, tint = Color.White, modifier = Modifier.size(22.dp))
    }
}

@Composable
private fun EmptyCard(text: String) {
    Card(colors = CardDefaults.cardColors(containerColor = Color.White),
        border = androidx.compose.foundation.BorderStroke(1.dp, KilivoStroke),
        shape = RoundedCornerShape(14.dp)) {
        Text(text, Modifier.fillMaxWidth().padding(14.dp), color = KilivoMuted, fontSize = 13.sp)
    }
}

@Composable
private fun OfflineNote() {
    Text("Offline mode · Information is stored on this device.",
        Modifier.fillMaxWidth().padding(vertical = 10.dp), color = KilivoMuted, fontSize = 11.sp, textAlign = TextAlign.Center)
}

@Composable
private fun PreferenceToggle(title: String, subtitle: String, checked: Boolean, onChecked: (Boolean) -> Unit) {
    var enabled by remember { mutableStateOf(checked) }
    Card(colors = CardDefaults.cardColors(containerColor = Color.White),
        border = androidx.compose.foundation.BorderStroke(1.dp, KilivoStroke)) {
        Row(Modifier.fillMaxWidth().clickable { enabled = !enabled; onChecked(enabled) }.padding(14.dp),
            verticalAlignment = Alignment.CenterVertically) {
            Column(Modifier.weight(1f)) {
                Text(title, color = KilivoInk, fontWeight = FontWeight.Bold)
                Text(subtitle, color = KilivoMuted, fontSize = 12.sp)
            }
            androidx.compose.material3.Switch(checked = enabled, onCheckedChange = {
                enabled = it
                onChecked(it)
            })
        }
    }
}

private fun categoryColor(category: String): Color = when (category) {
    "Technology" -> Color(0xFF551BCF)
    "Impact" -> Color(0xFFDC5B00)
    "Projects" -> Color(0xFF00896F)
    else -> KilivoBlue
}

private fun tabFor(screen: ComposeScreen): ComposeScreen = when (screen) {
    ComposeScreen.DivisionDetail, ComposeScreen.Donation, ComposeScreen.DonationCheckout -> ComposeScreen.Divisions
    ComposeScreen.Search -> ComposeScreen.Search
    ComposeScreen.Updates, ComposeScreen.UpdateDetail, ComposeScreen.Announcements,
    ComposeScreen.AnnouncementDetail, ComposeScreen.Notifications -> ComposeScreen.Updates
    ComposeScreen.Profile, ComposeScreen.EditAccount, ComposeScreen.Preferences, ComposeScreen.About,
    ComposeScreen.Help, ComposeScreen.Privacy, ComposeScreen.Interests, ComposeScreen.Pledges,
    ComposeScreen.Members, ComposeScreen.MemberDetail, ComposeScreen.Organization,
    ComposeScreen.Department, ComposeScreen.Assignments, ComposeScreen.Projects,
    ComposeScreen.ProjectDetail, ComposeScreen.Events, ComposeScreen.EventDetail,
    ComposeScreen.Documents, ComposeScreen.DocumentDetail -> ComposeScreen.Profile
    else -> ComposeScreen.Home
}

private fun toolbarTitle(route: ComposeRoute, divisions: List<ComposeDivision>, updates: List<ComposeNews>): String = when (route.screen) {
    ComposeScreen.Home -> "Home"
    ComposeScreen.Divisions -> "Our Divisions"
    ComposeScreen.Search -> "Search"
    ComposeScreen.Updates -> "Updates"
    ComposeScreen.Profile -> "Profile"
    ComposeScreen.EditAccount -> "Edit Account"
    ComposeScreen.DivisionDetail -> divisions.firstOrNull { it.id == route.value }?.title ?: "Division"
    ComposeScreen.UpdateDetail -> "News & Updates"
    ComposeScreen.Announcements -> "Official Announcements"
    ComposeScreen.AnnouncementDetail -> "Announcement"
    ComposeScreen.Members -> "Members Directory"
    ComposeScreen.MemberDetail -> "Member Details"
    ComposeScreen.Organization -> "Organization Structure"
    ComposeScreen.Department -> "My Department / Division"
    ComposeScreen.Assignments -> "My Assignments"
    ComposeScreen.Projects -> "Projects"
    ComposeScreen.ProjectDetail -> "Project Details"
    ComposeScreen.Events -> "Meetings & Events"
    ComposeScreen.EventDetail -> "Event Details"
    ComposeScreen.Documents -> "Documents & Resources"
    ComposeScreen.DocumentDetail -> "Document Details"
    ComposeScreen.Preferences -> "App Preferences"
    ComposeScreen.About -> "About KILIVO LABS"
    ComposeScreen.Help -> "Help & Support"
    ComposeScreen.Privacy -> "Privacy & Security"
    ComposeScreen.Notifications -> "Notifications"
    ComposeScreen.Donation -> "Join Our Impact"
    ComposeScreen.Pledges -> "My Donations"
    ComposeScreen.Interests -> "My Interests"
    else -> ""
}

private fun composeMembers() = listOf(
    ComposeMember("member-001", "Asha Mwakalinga", "Project Coordinator", "KILIVO PROJECTS", "asha@example.test"),
    ComposeMember("member-002", "Daniel Mushi", "Technology Lead", "KILIVO TECHNOLOGIES", "daniel@example.test"),
    ComposeMember("member-003", "Neema Joseph", "Community Officer", "KILIVO IMPACT", "neema@example.test"),
    ComposeMember("member-004", "Peter Mrema", "Business Associate", "KILIVO BUSINESS", "peter@example.test")
)

private fun composeAssignments() = listOf(
    ComposeWorkspaceRecord("assignment-001", "Community Skills Workshop", "Prepare the member training plan", "In progress", "Due 20 Nov"),
    ComposeWorkspaceRecord("project-001", "KILIVO Office Upgrade", "Facilities and project delivery", "Planning", "Updated 10 Nov"),
    ComposeWorkspaceRecord("assignment-002", "Quarterly Division Report", "Compile progress and milestones", "Not started", "Due 28 Nov")
)

private fun composeEvents() = listOf(
    ComposeWorkspaceRecord("event-001", "Members Monthly Briefing", "Main conference room · Hybrid", "Upcoming", "18 Nov 2026 · 10:00"),
    ComposeWorkspaceRecord("event-002", "Project Review Session", "KILIVO PROJECTS", "Upcoming", "21 Nov 2026 · 14:00"),
    ComposeWorkspaceRecord("event-003", "Community Outreach Planning", "KILIVO IMPACT", "Upcoming", "26 Nov 2026 · 09:30")
)

private fun composeDocuments() = listOf(
    ComposeWorkspaceRecord("document-001", "Member Handbook", "Policies and company guidance · PDF", "Available", "Updated 4 Nov 2026"),
    ComposeWorkspaceRecord("document-002", "Project Request Template", "Workspace template · DOCX", "Available", "Updated 28 Oct 2026"),
    ComposeWorkspaceRecord("document-003", "Brand Guidelines", "Communications resource · PDF", "Available", "Updated 12 Oct 2026")
)

private fun composeNotifications() = listOf(
    ComposeNotice("notification-001", "Members Monthly Briefing", "The next members briefing is scheduled for 18 November.", "Today · 09:15", false),
    ComposeNotice("notification-002", "Project reporting reminder", "Please prepare division milestones for the quarterly review.", "Yesterday · 16:40", false),
    ComposeNotice("notification-003", "Workspace resources updated", "The member handbook has been updated.", "10 Nov · 11:20", true)
)

private fun composeDonationHistory() = listOf(
    ComposeWorkspaceRecord("donation-001", "TZS 20,000", "Education & Awareness", "Succeeded", "4 Nov 2026"),
    ComposeWorkspaceRecord("donation-002", "TZS 10,000", "Community Development", "Pending", "12 Nov 2026"),
    ComposeWorkspaceRecord("donation-003", "TZS 5,000", "Humanitarian Support", "Refunded", "30 Oct 2026")
)

private fun composeAnnouncements() = listOf(
    ComposeNews(
        "Members Monthly Briefing",
        "Nov 18, 2026",
        "Company",
        R.drawable.home_skyline,
        "All members are invited to the monthly briefing. The meeting will cover division updates and upcoming priorities."
    ),
    ComposeNews(
        "Workspace Access and Document Update",
        "Nov 10, 2026",
        "Workspace",
        R.drawable.business_buildings,
        "Company workspace resources are being organized by department. Contact your department lead if you need access."
    ),
    ComposeNews(
        "Quarterly Project Reporting",
        "Nov 4, 2026",
        "Projects",
        R.drawable.project_site,
        "Division teams should prepare project milestones and status information for the quarterly review."
    )
)

private fun composeDivisions() = listOf(
    ComposeDivision("business", "KILIVO BUSINESS", "Business", "Commerce & More",
        "Explore our business ventures across various industries.",
        Color(0xFF0C49C1), Color(0xFFCDE1FF), Icons.Filled.BusinessCenter, R.drawable.business_buildings,
        "Business Areas", listOf(
            ComposeFeature("Trading", "Trade and distribution", Icons.Filled.BusinessCenter),
            ComposeFeature("Retail", "Products and customer service", Icons.Filled.ShoppingCart),
            ComposeFeature("Agriculture", "Sustainable agriculture", Icons.Filled.Engineering),
            ComposeFeature("Logistics", "Movement and delivery", Icons.Filled.LocalShipping),
            ComposeFeature("Real Estate", "Property and development", Icons.Filled.Apartment),
            ComposeFeature("Hospitality", "Guest and travel services", Icons.Filled.BusinessCenter)
        )),
    ComposeDivision("technology", "KILIVO TECHNOLOGIES", "Technologies", "Tech for a Better World",
        "Innovative solutions, digital products and IT services.",
        Color(0xFF551BCF), Color(0xFFE1D2FF), Icons.Filled.Code, R.drawable.technology_laptop,
        "Our Focus Areas", listOf(
            ComposeFeature("Software Development", "Custom systems and applications", Icons.Filled.Code),
            ComposeFeature("Mobile & Web Apps", "Digital products for every screen", Icons.Filled.GridView),
            ComposeFeature("IT Consultancy", "Practical technology guidance", Icons.Filled.Help),
            ComposeFeature("AI & Innovation", "Explore emerging technologies", Icons.Filled.Engineering),
            ComposeFeature("Digital Solutions", "Tools, platforms and integration", Icons.Filled.InsertChart)
        )),
    ComposeDivision("projects", "KILIVO PROJECTS", "Projects", "Projects & Opportunities",
        "Find, manage and deliver projects plus connect with opportunities.",
        Color(0xFF00896F), Color(0xFFC2EEE0), Icons.Filled.Engineering, R.drawable.project_site,
        "What We Do", listOf(
            ComposeFeature("Project Execution", "Deliver work from plan to completion", Icons.Filled.CheckCircle),
            ComposeFeature("Professional Opportunities", "Connect skills with opportunities", Icons.Filled.GridView),
            ComposeFeature("Project Management", "Organize teams, time and resources", Icons.Filled.InsertChart),
            ComposeFeature("Business Partnerships", "Build practical collaborations", Icons.Filled.BusinessCenter)
        )),
    ComposeDivision("impact", "KILIVO IMPACT", "Impact", "Community & Hope",
        "Social development, charity and community empowerment.",
        Color(0xFFEF6700), Color(0xFFFFDDB8), Icons.Filled.VolunteerActivism, R.drawable.impact_students,
        "Our Programs", listOf(
            ComposeFeature("Community Development", "Stronger, more resilient communities", Icons.Filled.VolunteerActivism),
            ComposeFeature("Youth Empowerment", "Support young people to thrive", Icons.Filled.Engineering),
            ComposeFeature("Education & Awareness", "Learning and essential knowledge", Icons.Filled.MenuBook),
            ComposeFeature("Humanitarian Support", "Care for people in need", Icons.Filled.Favorite)
        ))
)

private fun composeUpdates() = listOf(
    ComposeNews("KILIVO LABS Launches New Tech Initiative", "Nov 8, 2025", "Technology",
        R.drawable.technology_laptop, "KILIVO LABS is expanding access to practical technology and digital skills through a new community initiative."),
    ComposeNews("Community Health Outreach Success", "Nov 1, 2025", "Impact",
        R.drawable.impact_students, "Community partners came together to share information and support local wellbeing."),
    ComposeNews("New Project Opportunities", "Oct 28, 2025", "Projects",
        R.drawable.project_site, "Explore professional opportunities and projects that connect people, ideas and practical delivery."),
    ComposeNews("Tips for Online Safety", "Oct 25, 2025", "Technology",
        R.drawable.technology_laptop, "Simple habits can help you protect your devices, accounts and personal information online."),
    ComposeNews("Support Education in Tanzania", "Oct 20, 2025", "Impact",
        R.drawable.impact_students, "Education and awareness programs help create more opportunities for children and families.")
)
