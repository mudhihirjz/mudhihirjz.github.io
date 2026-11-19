# KILIVO LABS Admin

Tauri desktop workspace for the content and records required by the KILIVO
LABS company and mobile app: company and division profiles, member applications
and directory, assignments, events, documents, news, and announcements.
Member reports and CSV exports are included as supporting tools.

The public website's page structure, navigation, headings, header, and footer
are fixed. Admin manages content shown within that structure; it does not
create pages, menus, or SEO settings.

The company profile includes the built-in white and blue KILIVO K logo
variants for selection; logo files do not need to be uploaded.

Content edits and uploaded images are saved on this computer in the operating
system's application data folder. This is a local desktop workspace, not a
shared server: edits are **not** published to `Kilivo_web` or the mobile app,
and are not backed up or synchronized to other computers.

Workers App assignments, events, and documents are local management records
for the mobile app's current screens. Assignments can be associated with an
active local member, events can be targeted to a division, and documents can
be restricted to a division or made available to all members. Publishing only
marks the local preview as available; it does not send push notifications or
sync content to mobile devices.

Resource files may be PDF, DOCX, XLSX, or PPTX up to 10 MB. Files and their
metadata are stored locally until a shared API is implemented.

Company Overview is read-only and loads live data with
`GET /api/v1/admin/dashboard?range=30d`. Configure the backend base URL with
`VITE_ADMIN_API_BASE_URL` when building/running the app. The backend must return
the `companyOverview` object described in `../Kilivo_web/API_PROPOSAL.md`; until
that API and its admin session are available, the screen will show an explicit
configuration or request error rather than sample figures.

The initial records are starter content and should be reviewed before use.
Member applications and directory entries use clearly marked local mock data,
including local attachment storage. The app does not create login credentials
or send invitations; passwords, real member roles, analytics, and cross-app
publishing are not managed by this local content editor.

The Admin sign-in and profile are also mock UI. Sign-in accepts any valid
email and non-empty password without checking credentials; the password is
never stored. The signed-in flag lasts only for the current webview session,
and the editable display name/email are stored in local browser storage. This
does not protect the desktop app or its local data.

On first use, the Members page creates five sample applications and two
corresponding approved sample members. Locally added application attachments
are limited to PDF/JPEG/PNG/WebP files up to 10 MB. Approving an application
only updates local mock records; secure invitation delivery requires the
backend email service and is not simulated as sent.

The dashboard retains local member summaries and CSV exports, a local content
update list, backend connection details, and Admin help topics. Placeholder
screens for website analytics, roles, admin accounts, security events,
activity logs, and support-message drafts have been removed because they do
not perform those functions.

Company profile and division details return to read-only mode after saving;
select **Edit** to make further changes. Content and member editors also close
after a successful save. The Admin content store remains local: mobile content
sync and public-site publishing are not connected yet. The mobile app's
account and help screens are therefore not managed through this Admin build.

Projects and impact programs are managed from inside their owning division.
News articles and announcements can be associated with a division or left
company-wide. The standalone Projects & Impact menu has been removed.

## Development

```sh
npm install
npm run tauri dev
```

## Build a Fedora RPM

Requirements: Rust, Node.js, GTK 3, WebKitGTK 4.1, and `rpmbuild`.

```sh
npm install
npm run tauri:rpm
```

The package is written to:

```text
src-tauri/target/release/bundle/rpm/KILIVO LABS Admin-0.5.4-1.x86_64.rpm
```

On Linux, app content is stored under:

```text
~/.local/share/tz.co.kilivolabs.admin/content.json
~/.local/share/tz.co.kilivolabs.admin/uploads/
~/.local/share/tz.co.kilivolabs.admin/resource-files/
```

Install on Fedora:

```sh
sudo dnf install ./src-tauri/target/release/bundle/rpm/KILIVO\ LABS\ Admin-0.5.4-1.x86_64.rpm
```
