package com.kilivolabs.app;

import android.app.Activity;
import android.app.AlertDialog;
import android.os.Build;
import android.graphics.Color;
import android.graphics.Typeface;
import android.graphics.drawable.GradientDrawable;
import android.os.Bundle;
import android.text.InputType;
import android.util.Patterns;
import android.view.Gravity;
import android.view.View;
import android.view.ViewGroup;
import android.view.Window;
import android.view.WindowInsets;
import android.widget.EditText;
import android.widget.FrameLayout;
import android.widget.LinearLayout;
import android.widget.PopupMenu;
import android.widget.ScrollView;
import android.widget.TextView;
import android.widget.Toast;

import java.util.ArrayList;
import java.util.List;

public class MainActivity extends Activity {
    private static final int COLOR_BACKGROUND = Color.rgb(19, 19, 25);
    private static final int COLOR_HEADER = Color.rgb(25, 24, 33);
    private static final int COLOR_CARD = Color.rgb(27, 27, 38);
    private static final int COLOR_TEAL = Color.rgb(12, 190, 182);
    private static final int COLOR_TEXT = Color.rgb(248, 248, 250);
    private static final int COLOR_MUTED = Color.rgb(194, 192, 201);

    private final List<Anchor> anchors = new ArrayList<>();
    private ScrollView pageScroll;

    private static final class Anchor {
        final String label;
        final View view;

        Anchor(String label, View view) {
            this.label = label;
            this.view = view;
        }
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        Window window = getWindow();
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.R) {
            window.setDecorFitsSystemWindows(false);
        }
        window.setStatusBarColor(COLOR_HEADER);
        window.setNavigationBarColor(COLOR_BACKGROUND);

        LinearLayout root = new LinearLayout(this);
        root.setOrientation(LinearLayout.VERTICAL);
        root.setBackgroundColor(COLOR_BACKGROUND);
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.R) {
            root.setOnApplyWindowInsetsListener((view, insets) -> {
                android.graphics.Insets systemBars = insets.getInsets(WindowInsets.Type.systemBars());
                view.setPadding(0, systemBars.top, 0, systemBars.bottom);
                return insets;
            });
        }
        root.addView(createHeader(), new LinearLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT, dp(76)));

        pageScroll = new ScrollView(this);
        pageScroll.setFillViewport(true);
        pageScroll.setClipToPadding(false);
        pageScroll.setVerticalScrollBarEnabled(false);

        LinearLayout page = new LinearLayout(this);
        page.setOrientation(LinearLayout.VERTICAL);
        page.setPadding(0, 0, 0, dp(18));
        pageScroll.addView(page);
        root.addView(pageScroll, new LinearLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT, 0, 1));

        View hero = createHero();
        page.addView(hero);
        LinearLayout systems = createSystems();
        page.addView(systems);
        anchors.add(new Anchor("Products", systems));
        anchors.add(new Anchor("Solutions", hero));

        View mobileApps = createMobileApps();
        page.addView(mobileApps);
        anchors.add(new Anchor("Docs", mobileApps));

        page.addView(createContactActions());
        anchors.add(new Anchor("Pricing", page.getChildAt(page.getChildCount() - 1)));

        TextView footer = createFooter();
        page.addView(footer);
        anchors.add(new Anchor("About", footer));

        setContentView(root);
    }

    private View createHeader() {
        LinearLayout header = new LinearLayout(this);
        header.setGravity(Gravity.CENTER_VERTICAL);
        header.setPadding(dp(18), 0, dp(18), 0);
        header.setBackgroundColor(COLOR_HEADER);

        TextView mark = new TextView(this);
        mark.setText("K");
        mark.setTextColor(COLOR_TEAL);
        mark.setTextSize(25);
        mark.setTypeface(Typeface.DEFAULT, Typeface.BOLD);
        mark.setGravity(Gravity.CENTER);
        mark.setBackground(background(Color.rgb(33, 37, 47), dp(12),
                COLOR_TEAL, dp(1)));
        mark.setContentDescription("Kilivo Labs home");
        mark.setOnClickListener(view -> pageScroll.smoothScrollTo(0, 0));
        header.addView(mark, new LinearLayout.LayoutParams(dp(42), dp(42)));

        TextView brand = new TextView(this);
        brand.setText(R.string.brand_name);
        brand.setTextColor(COLOR_TEXT);
        brand.setTextSize(23);
        brand.setTypeface(Typeface.create("sans-serif", Typeface.BOLD));
        brand.setLetterSpacing(-0.035f);
        brand.setOnClickListener(view -> pageScroll.smoothScrollTo(0, 0));
        LinearLayout.LayoutParams brandParams = new LinearLayout.LayoutParams(
                0, ViewGroup.LayoutParams.WRAP_CONTENT, 1);
        brandParams.leftMargin = dp(10);
        header.addView(brand, brandParams);

        View menuButton = new MenuButton(this);
        menuButton.setContentDescription("Open menu");
        menuButton.setFocusable(true);
        menuButton.setOnClickListener(this::showNavigationMenu);
        header.addView(menuButton, new LinearLayout.LayoutParams(dp(46), dp(46)));
        return header;
    }

    private void showNavigationMenu(View anchor) {
        PopupMenu menu = new PopupMenu(this, anchor);
        menu.getMenu().add("Products");
        menu.getMenu().add("Solutions");
        menu.getMenu().add("Docs");
        menu.getMenu().add("Pricing");
        menu.getMenu().add("About");
        menu.getMenu().add("Sign in");
        menu.getMenu().add("Contact");
        menu.setOnMenuItemClickListener(item -> {
            if (item.getTitle().equals("Sign in")) {
                showContactDialog("Sign in");
                return true;
            }
            if (item.getTitle().equals("Contact")) {
                showContactDialog("Contact Kilivo Labs");
                return true;
            }
            for (Anchor destination : anchors) {
                if (destination.label.contentEquals(item.getTitle())) {
                    scrollTo(destination.view);
                    return true;
                }
            }
            return false;
        });
        menu.show();
    }

    private void scrollTo(View target) {
        int[] targetPosition = new int[2];
        int[] scrollPosition = new int[2];
        target.getLocationOnScreen(targetPosition);
        pageScroll.getLocationOnScreen(scrollPosition);
        pageScroll.smoothScrollTo(0, pageScroll.getScrollY()
                + targetPosition[1] - scrollPosition[1] - dp(12));
    }

    private View createHero() {
        LinearLayout hero = new LinearLayout(this);
        hero.setOrientation(LinearLayout.VERTICAL);
        hero.setPadding(dp(20), dp(32), dp(20), dp(24));
        GradientDrawable heroBackground = new GradientDrawable(
                GradientDrawable.Orientation.TL_BR,
                new int[]{Color.rgb(24, 34, 39), COLOR_BACKGROUND, COLOR_BACKGROUND});
        heroBackground.setGradientType(GradientDrawable.LINEAR_GRADIENT);
        hero.setBackground(heroBackground);

        TextView heading = new TextView(this);
        heading.setText(R.string.hero_title);
        heading.setTextColor(COLOR_TEXT);
        heading.setTextSize(32);
        heading.setTypeface(Typeface.create("sans-serif", Typeface.BOLD));
        heading.setLineSpacing(0, 1.08f);
        hero.addView(heading);

        LinearLayout buttons = new LinearLayout(this);
        buttons.setGravity(Gravity.CENTER_VERTICAL);
        buttons.setOrientation(LinearLayout.HORIZONTAL);
        LinearLayout.LayoutParams buttonsParams = new LinearLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT, dp(50));
        buttonsParams.topMargin = dp(22);
        hero.addView(buttons, buttonsParams);

        TextView requestButton = actionButton("Request a System", true);
        requestButton.setOnClickListener(view -> showContactDialog("Request a system"));
        buttons.addView(requestButton, new LinearLayout.LayoutParams(0,
                ViewGroup.LayoutParams.MATCH_PARENT, 1));

        TextView contactButton = actionButton("Contact Us", false);
        contactButton.setOnClickListener(view -> showContactDialog("Contact us"));
        LinearLayout.LayoutParams contactParams = new LinearLayout.LayoutParams(0,
                ViewGroup.LayoutParams.MATCH_PARENT, 1);
        contactParams.leftMargin = dp(10);
        buttons.addView(contactButton, contactParams);
        return hero;
    }

    private LinearLayout createSystems() {
        LinearLayout section = new LinearLayout(this);
        section.setOrientation(LinearLayout.VERTICAL);
        section.setPadding(dp(18), dp(14), dp(18), 0);

        TextView title = new TextView(this);
        title.setText(R.string.systems_heading);
        title.setTextColor(COLOR_TEAL);
        title.setTextSize(20);
        title.setTypeface(Typeface.create("sans-serif", Typeface.BOLD));
        title.setLetterSpacing(0.025f);
        section.addView(title);

        addSystemCard(section, "KILIVOSAFARI BOOKING SYSTEM",
                "Planned for intercity bus bookings & fleet management.",
                "Product details, features, and downloads will be shared when this system is available.",
                ProductIconView.BUS);
        addSystemCard(section, "SHULEBORA SYSTEM",
                "Planned for school admissions, fees, exams & reporting.",
                "Product details, features, and downloads will be shared when this system is available.",
                ProductIconView.SCHOOL);
        addSystemCard(section, "DUKABORA POS",
                "Planned point of sale & inventory for shops and retailers.",
                "Product details, features, and downloads will be shared when this system is available.",
                ProductIconView.SHOP);
        addSystemCard(section, "AFYABORA CLINIC SYSTEM",
                "Planned for clinic appointments, patients & prescriptions.",
                "Product details, features, and downloads will be shared when this system is available.",
                ProductIconView.HEALTH);
        return section;
    }

    private void addSystemCard(LinearLayout parent, String name, String description,
                               String details, int icon) {
        LinearLayout card = new LinearLayout(this);
        card.setOrientation(LinearLayout.VERTICAL);
        card.setPadding(dp(14), dp(12), dp(12), dp(11));
        card.setBackground(background(COLOR_CARD, dp(16),
                Color.rgb(42, 43, 55), dp(1)));
        card.setClickable(true);
        card.setFocusable(true);
        card.setContentDescription(name + ". Tap to view details.");

        LinearLayout.LayoutParams cardParams = new LinearLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT);
        cardParams.topMargin = dp(12);

        FrameLayout cardFrame = new FrameLayout(this);
        cardFrame.addView(card, new FrameLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT));
        View accent = new View(this);
        accent.setBackground(background(COLOR_TEAL, dp(2), COLOR_TEAL, 0));
        FrameLayout.LayoutParams accentParams = new FrameLayout.LayoutParams(dp(4),
                ViewGroup.LayoutParams.MATCH_PARENT, Gravity.START);
        cardFrame.addView(accent, accentParams);
        parent.addView(cardFrame, cardParams);

        LinearLayout headingRow = new LinearLayout(this);
        headingRow.setGravity(Gravity.CENTER_VERTICAL);
        card.addView(headingRow);

        ProductIconView productIcon = new ProductIconView(this, icon);
        headingRow.addView(productIcon, new LinearLayout.LayoutParams(dp(52), dp(52)));

        TextView productName = new TextView(this);
        productName.setText(name);
        productName.setTextColor(COLOR_TEXT);
        productName.setTextSize(15);
        productName.setTypeface(Typeface.create("sans-serif", Typeface.BOLD));
        productName.setLineSpacing(0, 1.05f);
        LinearLayout.LayoutParams nameParams = new LinearLayout.LayoutParams(
                0, ViewGroup.LayoutParams.WRAP_CONTENT, 1);
        nameParams.leftMargin = dp(12);
        headingRow.addView(productName, nameParams);

        LinearLayout chips = new LinearLayout(this);
        chips.setGravity(Gravity.CENTER_VERTICAL);
        chips.setOrientation(LinearLayout.HORIZONTAL);
        LinearLayout.LayoutParams chipsParams = new LinearLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT);
        chipsParams.leftMargin = dp(64);
        chipsParams.topMargin = dp(10);
        card.addView(chips, chipsParams);
        String[] appNames = {"Desktop App", "Owner App", "Agent App"};
        for (int i = 0; i < appNames.length; i++) {
            TextView chip = appChip(appNames[i]);
            LinearLayout.LayoutParams chipParams = new LinearLayout.LayoutParams(
                    0, dp(26), 1);
            if (i > 0) {
                chipParams.leftMargin = dp(5);
            }
            chips.addView(chip, chipParams);
        }

        TextView detailsText = new TextView(this);
        detailsText.setText(details);
        detailsText.setTextColor(COLOR_MUTED);
        detailsText.setTextSize(12);
        detailsText.setLineSpacing(dp(2), 1f);
        detailsText.setVisibility(View.GONE);
        LinearLayout.LayoutParams detailsParams = new LinearLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT);
        detailsParams.leftMargin = dp(64);
        detailsParams.topMargin = dp(9);
        card.addView(detailsText, detailsParams);

        card.setOnClickListener(view -> {
            boolean showDetails = detailsText.getVisibility() != View.VISIBLE;
            detailsText.setVisibility(showDetails ? View.VISIBLE : View.GONE);
            card.setContentDescription(name + (showDetails
                    ? ". Details expanded. Tap to collapse."
                    : ". Details collapsed. Tap to view details."));
        });
    }

    private View createMobileApps() {
        LinearLayout panel = new LinearLayout(this);
        panel.setOrientation(LinearLayout.VERTICAL);
        panel.setGravity(Gravity.CENTER_HORIZONTAL);
        panel.setPadding(dp(14), dp(20), dp(14), dp(18));
        GradientDrawable panelBackground = new GradientDrawable(
                GradientDrawable.Orientation.TL_BR,
                new int[]{Color.rgb(8, 126, 122), Color.rgb(7, 94, 92)});
        panelBackground.setCornerRadius(dp(18));
        panel.setBackground(panelBackground);

        LinearLayout.LayoutParams panelParams = new LinearLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT);
        panelParams.setMargins(dp(16), dp(22), dp(16), 0);
        panel.setLayoutParams(panelParams);

        TextView heading = new TextView(this);
        heading.setText(R.string.mobile_apps_heading);
        heading.setTextColor(COLOR_TEXT);
        heading.setTextSize(22);
        heading.setTypeface(Typeface.create("sans-serif", Typeface.BOLD));
        heading.setGravity(Gravity.CENTER);
        panel.addView(heading);

        TextView status = new TextView(this);
        status.setText(R.string.mobile_apps_status);
        status.setTextColor(Color.rgb(224, 245, 242));
        status.setTextSize(12);
        status.setGravity(Gravity.CENTER);
        LinearLayout.LayoutParams statusParams = new LinearLayout.LayoutParams(
                ViewGroup.LayoutParams.WRAP_CONTENT, ViewGroup.LayoutParams.WRAP_CONTENT);
        statusParams.topMargin = dp(3);
        panel.addView(status, statusParams);

        LinearLayout badges = new LinearLayout(this);
        badges.setGravity(Gravity.CENTER);
        badges.setOrientation(LinearLayout.HORIZONTAL);
        LinearLayout.LayoutParams badgesParams = new LinearLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT, dp(50));
        badgesParams.topMargin = dp(14);
        panel.addView(badges, badgesParams);

        badges.addView(playStoreBadge("KILIVOSAFARI"), new LinearLayout.LayoutParams(
                0, ViewGroup.LayoutParams.MATCH_PARENT, 1));
        View spacer = new View(this);
        badges.addView(spacer, new LinearLayout.LayoutParams(dp(8), 1));
        badges.addView(playStoreBadge("OWNER APP"), new LinearLayout.LayoutParams(
                0, ViewGroup.LayoutParams.MATCH_PARENT, 1));
        return panel;
    }

    private View playStoreBadge(String appName) {
        LinearLayout badge = new LinearLayout(this);
        badge.setGravity(Gravity.CENTER);
        badge.setOrientation(LinearLayout.HORIZONTAL);
        badge.setPadding(dp(5), dp(4), dp(5), dp(4));
        badge.setBackground(background(Color.rgb(5, 5, 7), dp(7),
                Color.rgb(145, 145, 153), dp(1)));
        badge.setContentDescription(appName + ", coming soon to Google Play");

        TextView playMark = new TextView(this);
        playMark.setText("▶");
        playMark.setTextColor(Color.rgb(74, 213, 190));
        playMark.setTextSize(24);
        LinearLayout.LayoutParams markParams = new LinearLayout.LayoutParams(
                ViewGroup.LayoutParams.WRAP_CONTENT, ViewGroup.LayoutParams.WRAP_CONTENT);
        markParams.rightMargin = dp(5);
        badge.addView(playMark, markParams);

        LinearLayout copy = new LinearLayout(this);
        copy.setOrientation(LinearLayout.VERTICAL);
        copy.setGravity(Gravity.CENTER_VERTICAL);
        badge.addView(copy);

        TextView label = new TextView(this);
        label.setText(appName);
        label.setTextColor(Color.WHITE);
        label.setTextSize(8);
        label.setSingleLine(true);
        copy.addView(label);

        TextView store = new TextView(this);
        store.setText(R.string.google_play);
        store.setTextColor(Color.WHITE);
        store.setTextSize(14);
        store.setTypeface(Typeface.create("sans-serif", Typeface.BOLD));
        copy.addView(store);
        return badge;
    }

    private View createContactActions() {
        LinearLayout actions = new LinearLayout(this);
        actions.setOrientation(LinearLayout.HORIZONTAL);
        actions.setPadding(dp(18), 0, dp(18), 0);
        LinearLayout.LayoutParams actionsParams = new LinearLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT, dp(48));
        actionsParams.topMargin = dp(16);
        actions.setLayoutParams(actionsParams);

        TextView integration = actionButton("Request Custom Integration", false);
        integration.setTextSize(11);
        integration.setOnClickListener(view -> showContactDialog("Request custom integration"));
        actions.addView(integration, new LinearLayout.LayoutParams(0,
                ViewGroup.LayoutParams.MATCH_PARENT, 1));

        TextView sales = actionButton("Talk to Sales", true);
        sales.setTextSize(12);
        sales.setOnClickListener(view -> showContactDialog("Talk to sales"));
        LinearLayout.LayoutParams salesParams = new LinearLayout.LayoutParams(0,
                ViewGroup.LayoutParams.MATCH_PARENT, 1);
        salesParams.leftMargin = dp(10);
        actions.addView(sales, salesParams);
        return actions;
    }

    private TextView createFooter() {
        TextView footer = new TextView(this);
        footer.setText(getString(R.string.footer_text,
                java.util.Calendar.getInstance().get(java.util.Calendar.YEAR)));
        footer.setTextColor(Color.rgb(142, 139, 148));
        footer.setTextSize(11);
        footer.setGravity(Gravity.CENTER);
        footer.setPadding(dp(14), dp(19), dp(14), dp(12));
        return footer;
    }

    private TextView actionButton(String text, boolean primary) {
        TextView button = new TextView(this);
        button.setText(text);
        button.setTextSize(13);
        button.setTypeface(Typeface.create("sans-serif", Typeface.BOLD));
        button.setGravity(Gravity.CENTER);
        button.setPadding(dp(7), dp(4), dp(7), dp(4));
        button.setTextColor(primary ? Color.WHITE : COLOR_TEAL);
        button.setBackground(background(
                primary ? COLOR_TEAL : Color.TRANSPARENT,
                dp(14), primary ? COLOR_TEAL : COLOR_TEAL, dp(1)));
        button.setClickable(true);
        button.setFocusable(true);
        button.setMinHeight(dp(44));
        return button;
    }

    private TextView appChip(String text) {
        TextView chip = new TextView(this);
        chip.setText(text);
        chip.setTextColor(COLOR_TEXT);
        chip.setTextSize(9);
        chip.setTypeface(Typeface.create("sans-serif", Typeface.BOLD));
        chip.setGravity(Gravity.CENTER);
        chip.setSingleLine(true);
        chip.setPadding(dp(3), 0, dp(3), 0);
        chip.setBackground(background(Color.TRANSPARENT, dp(9), COLOR_TEAL, dp(1)));
        return chip;
    }

    private void showContactDialog(String title) {
        LinearLayout form = new LinearLayout(this);
        form.setOrientation(LinearLayout.VERTICAL);
        form.setPadding(dp(22), dp(16), dp(22), dp(8));
        form.setBackgroundColor(Color.rgb(248, 248, 249));

        EditText name = formField("Your name", InputType.TYPE_CLASS_TEXT
                | InputType.TYPE_TEXT_FLAG_CAP_WORDS, false);
        EditText email = formField("Email address", InputType.TYPE_CLASS_TEXT
                | InputType.TYPE_TEXT_VARIATION_EMAIL_ADDRESS, false);
        EditText message = formField("How can we help?", InputType.TYPE_CLASS_TEXT
                | InputType.TYPE_TEXT_FLAG_CAP_SENTENCES
                | InputType.TYPE_TEXT_FLAG_MULTI_LINE, true);
        addFormField(form, "Your name", name);
        addFormField(form, "Email address", email);
        addFormField(form, "How can we help?", message);

        AlertDialog dialog = new AlertDialog.Builder(this)
                .setTitle(title)
                .setView(form)
                .setNegativeButton("Cancel", null)
                .setPositiveButton("Send request", null)
                .create();
        dialog.setOnShowListener(ignored -> dialog.getButton(AlertDialog.BUTTON_POSITIVE)
                .setOnClickListener(view -> {
                    if (name.getText().toString().trim().isEmpty()) {
                        name.setError("Enter your name");
                        name.requestFocus();
                    } else if (!Patterns.EMAIL_ADDRESS.matcher(
                            email.getText().toString().trim()).matches()) {
                        email.setError("Enter a valid email address");
                        email.requestFocus();
                    } else if (message.getText().toString().trim().isEmpty()) {
                        message.setError("Tell us how we can help");
                        message.requestFocus();
                    } else {
                        Toast.makeText(this,
                                "Demo only — your message was not sent or saved.",
                                Toast.LENGTH_LONG).show();
                        dialog.dismiss();
                    }
                }));
        dialog.show();
    }

    private EditText formField(String hint, int inputType, boolean multiline) {
        EditText field = new EditText(this);
        field.setHint(hint);
        field.setInputType(inputType);
        field.setTextColor(Color.rgb(25, 24, 30));
        field.setHintTextColor(Color.rgb(116, 113, 122));
        field.setTextSize(14);
        if (multiline) {
            field.setMinLines(3);
            field.setGravity(Gravity.TOP | Gravity.START);
        } else {
            field.setSingleLine(true);
        }
        return field;
    }

    private void addFormField(LinearLayout form, String labelText, EditText field) {
        TextView label = new TextView(this);
        label.setText(labelText);
        label.setTextColor(Color.rgb(48, 46, 53));
        label.setTextSize(12);
        label.setTypeface(Typeface.DEFAULT, Typeface.BOLD);
        form.addView(label);

        LinearLayout.LayoutParams fieldParams = new LinearLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT);
        fieldParams.topMargin = dp(3);
        fieldParams.bottomMargin = dp(10);
        form.addView(field, fieldParams);
    }

    private GradientDrawable background(int color, int radius, int strokeColor, int strokeWidth) {
        GradientDrawable drawable = new GradientDrawable();
        drawable.setColor(color);
        drawable.setCornerRadius(radius);
        if (strokeWidth > 0) {
            drawable.setStroke(strokeWidth, strokeColor);
        }
        return drawable;
    }

    private int dp(float value) {
        return Math.round(value * getResources().getDisplayMetrics().density);
    }

    private static final class MenuButton extends View {
        private final android.graphics.Paint paint = new android.graphics.Paint(
                android.graphics.Paint.ANTI_ALIAS_FLAG);

        MenuButton(MainActivity context) {
            super(context);
            paint.setColor(COLOR_TEAL);
            paint.setStrokeWidth(context.dp(2.5f));
            paint.setStrokeCap(android.graphics.Paint.Cap.ROUND);
        }

        @Override
        protected void onDraw(android.graphics.Canvas canvas) {
            super.onDraw(canvas);
            float centerX = getWidth() / 2f;
            float centerY = getHeight() / 2f;
            float halfWidth = getResources().getDisplayMetrics().density * 12;
            float gap = getResources().getDisplayMetrics().density * 7;
            for (int i = -1; i <= 1; i++) {
                float y = centerY + i * gap;
                canvas.drawLine(centerX - halfWidth, y, centerX + halfWidth, y, paint);
            }
        }
    }
}
