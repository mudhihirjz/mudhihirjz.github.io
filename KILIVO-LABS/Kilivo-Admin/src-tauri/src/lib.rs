use base64::{Engine as _, engine::general_purpose::STANDARD};
use serde::{Deserialize, Serialize};
use std::{
    fs,
    io::Write,
    path::{Path, PathBuf},
    sync::Mutex,
    time::{SystemTime, UNIX_EPOCH},
};
use tauri::{AppHandle, Manager, State};

const MAX_IMAGE_BYTES: usize = 10 * 1024 * 1024;
const MAX_MEMBER_ATTACHMENT_BYTES: usize = 10 * 1024 * 1024;
const MAX_RESOURCE_FILE_BYTES: usize = 10 * 1024 * 1024;
const CONTENT_SCHEMA_VERSION: u32 = 4;
const CONTENT_KINDS: &[&str] = &[
    "company",
    "division",
    "project",
    "impact",
    "news",
    "announcement",
    "page",
    "navigation",
    "seo",
    "assignment",
    "event",
    "document",
];

#[derive(Clone, Debug, Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
struct ContentRecord {
    id: String,
    kind: String,
    title: String,
    summary: String,
    body: String,
    status: String,
    image: Option<String>,
    #[serde(default)]
    division_id: Option<String>,
    #[serde(default)]
    logo_white: Option<String>,
    #[serde(default)]
    logo_blue: Option<String>,
    #[serde(default)]
    logo_variant: Option<LogoVariant>,
    #[serde(default)]
    assignee: Option<String>,
    #[serde(default)]
    due_date: Option<String>,
    #[serde(default)]
    work_status: Option<String>,
    #[serde(default)]
    starts_at: Option<String>,
    #[serde(default)]
    location: Option<String>,
    #[serde(default)]
    resource_file_id: Option<String>,
    #[serde(default)]
    resource_file_name: Option<String>,
    #[serde(default)]
    resource_mime_type: Option<String>,
    #[serde(default)]
    resource_size_bytes: Option<u64>,
    updated_at: String,
}

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
struct ResourceFileMetadata {
    id: String,
    file_name: String,
    mime_type: String,
    size_bytes: u64,
}

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
struct ResourceFilePayload {
    id: String,
    file_name: String,
    mime_type: String,
    size_bytes: u64,
    base64_data: String,
}

#[derive(Clone, Debug, Deserialize, PartialEq, Eq, Serialize)]
#[serde(rename_all = "lowercase")]
enum LogoVariant {
    White,
    Blue,
}

struct ContentLock(Mutex<()>);
struct MemberLock(Mutex<()>);

#[derive(Clone, Debug, Deserialize, PartialEq, Eq, Serialize)]
#[serde(rename_all = "snake_case")]
enum ApplicationType {
    KilivoMember,
    CommunityImpact,
}

#[derive(Clone, Debug, Deserialize, PartialEq, Eq, Serialize)]
#[serde(rename_all = "snake_case")]
enum ApplicationStatus {
    Pending,
    Approved,
    Rejected,
}

#[derive(Clone, Debug, Deserialize, PartialEq, Eq, Serialize)]
#[serde(rename_all = "snake_case")]
enum MemberStatus {
    Active,
    Inactive,
}

#[derive(Clone, Debug, Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
struct MemberAttachment {
    id: String,
    file_name: String,
    mime_type: String,
    size_bytes: u64,
}

#[derive(Clone, Debug, Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
struct MembershipApplication {
    id: String,
    full_name: String,
    email: String,
    phone: String,
    application_type: ApplicationType,
    status: ApplicationStatus,
    applied_at: String,
    message: String,
    attachments: Vec<MemberAttachment>,
    rejection_reason: Option<String>,
}

#[derive(Clone, Debug, Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
struct MemberRecord {
    id: String,
    full_name: String,
    email: String,
    phone: String,
    member_type: ApplicationType,
    status: MemberStatus,
    joined_at: String,
    invitation_status: String,
}

#[derive(Clone, Debug, Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
struct MemberWorkspaceData {
    applications: Vec<MembershipApplication>,
    members: Vec<MemberRecord>,
}

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
struct MemberAttachmentPayload {
    file_name: String,
    mime_type: String,
    base64_data: String,
}

fn announcement_seed() -> ContentRecord {
    ContentRecord {
        id: "announcement-briefing".into(),
        kind: "announcement".into(),
        title: "Members Monthly Briefing".into(),
        summary: "Monthly briefing for company members.".into(),
        body: "Add meeting details and internal updates here.".into(),
        status: "draft".into(),
        image: None,
        division_id: None,
        logo_white: None,
        logo_blue: None,
        logo_variant: None,
        assignee: None,
        due_date: None,
        work_status: None,
        starts_at: None,
        location: None,
        resource_file_id: None,
        resource_file_name: None,
        resource_mime_type: None,
        resource_size_bytes: None,
        updated_at: timestamp(),
    }
}

fn data_dir(app: &AppHandle) -> Result<PathBuf, String> {
    let path = app
        .path()
        .app_data_dir()
        .map_err(|error| error.to_string())?;
    fs::create_dir_all(&path)
        .map_err(|error| format!("Could not create admin data folder: {error}"))?;
    Ok(path)
}

fn content_path(app: &AppHandle) -> Result<PathBuf, String> {
    Ok(data_dir(app)?.join("content.json"))
}

fn timestamp() -> String {
    SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .map(|duration| duration.as_secs().to_string())
        .unwrap_or_else(|_| "0".to_string())
}

fn member_workspace_path(app: &AppHandle) -> Result<PathBuf, String> {
    Ok(data_dir(app)?.join("members.json"))
}

fn sample_application(
    id: &str,
    full_name: &str,
    email: &str,
    phone: &str,
    application_type: ApplicationType,
    status: ApplicationStatus,
    applied_at: &str,
    message: &str,
) -> MembershipApplication {
    MembershipApplication {
        id: id.into(),
        full_name: full_name.into(),
        email: email.into(),
        phone: phone.into(),
        application_type,
        status,
        applied_at: applied_at.into(),
        message: message.into(),
        attachments: Vec::new(),
        rejection_reason: None,
    }
}

fn seed_member_workspace() -> MemberWorkspaceData {
    let applications = vec![
        sample_application(
            "demo-application-aisha",
            "Aisha Mussa",
            "aisha.mussa@example.com",
            "+255 768 123 456",
            ApplicationType::KilivoMember,
            ApplicationStatus::Pending,
            "2025-11-12T10:24:00+03:00",
            "Ningependa kuwa sehemu ya KILIVO LABS kwa sababu ya kujifunza, kushirikiana na kuchangia maendeleo ya teknolojia nchini.",
        ),
        sample_application(
            "demo-application-juma",
            "Juma Said",
            "juma.said@example.com",
            "+255 754 222 115",
            ApplicationType::CommunityImpact,
            ApplicationStatus::Approved,
            "2025-11-11T04:18:00+03:00",
            "Ningependa kushiriki katika miradi ya maendeleo ya jamii.",
        ),
        sample_application(
            "demo-application-neema",
            "Neema Ali",
            "neema.ali@example.com",
            "+255 712 345 678",
            ApplicationType::KilivoMember,
            ApplicationStatus::Pending,
            "2025-11-10T09:32:00+03:00",
            "Nataka kujifunza zaidi kuhusu teknolojia na kushirikiana na wanachama wengine.",
        ),
        sample_application(
            "demo-application-daniel",
            "Daniel Mushi",
            "daniel.mushi@example.com",
            "+255 713 221 004",
            ApplicationType::CommunityImpact,
            ApplicationStatus::Rejected,
            "2025-11-09T02:20:00+03:00",
            "Ningependa kusaidia shughuli za maendeleo katika jamii yangu.",
        ),
        sample_application(
            "demo-application-grace",
            "Grace Peter",
            "grace.peter@example.com",
            "+255 755 811 229",
            ApplicationType::KilivoMember,
            ApplicationStatus::Approved,
            "2025-11-08T11:15:00+03:00",
            "Ningependa kuungana na jumuiya ya KILIVO LABS.",
        ),
    ];
    let members = applications
        .iter()
        .filter(|application| application.status == ApplicationStatus::Approved)
        .map(|application| MemberRecord {
            id: format!(
                "demo-member-{}",
                application.id.trim_start_matches("demo-application-")
            ),
            full_name: application.full_name.clone(),
            email: application.email.clone(),
            phone: application.phone.clone(),
            member_type: application.application_type.clone(),
            status: MemberStatus::Active,
            joined_at: application.applied_at.clone(),
            invitation_status: "mock_not_sent".into(),
        })
        .collect();
    MemberWorkspaceData {
        applications,
        members,
    }
}

fn write_member_workspace(app: &AppHandle, workspace: &MemberWorkspaceData) -> Result<(), String> {
    let path = member_workspace_path(app)?;
    let temporary_path = path.with_extension("json.tmp");
    let bytes = serde_json::to_vec_pretty(workspace)
        .map_err(|error| format!("Could not encode local member data: {error}"))?;
    let mut file = fs::File::create(&temporary_path)
        .map_err(|error| format!("Could not create local member data file: {error}"))?;
    file.write_all(&bytes)
        .map_err(|error| format!("Could not write local member data: {error}"))?;
    file.sync_all()
        .map_err(|error| format!("Could not sync local member data: {error}"))?;
    fs::rename(&temporary_path, path)
        .map_err(|error| format!("Could not save local member data: {error}"))
}

fn read_member_workspace(app: &AppHandle) -> Result<MemberWorkspaceData, String> {
    let path = member_workspace_path(app)?;
    if !path.exists() {
        let workspace = seed_member_workspace();
        write_member_workspace(app, &workspace)?;
        return Ok(workspace);
    }
    let bytes =
        fs::read(path).map_err(|error| format!("Could not read local member data: {error}"))?;
    serde_json::from_slice(&bytes).map_err(|error| format!("Local member data is invalid: {error}"))
}

fn validate_member_workspace(workspace: &MemberWorkspaceData) -> Result<(), String> {
    if workspace.applications.len() > 10_000 || workspace.members.len() > 100_000 {
        return Err("Local member data exceeds the supported record limit.".into());
    }
    for application in &workspace.applications {
        if application.full_name.trim().is_empty()
            || application.email.trim().is_empty()
            || !application.email.contains('@')
            || application.phone.trim().is_empty()
        {
            return Err(
                "Each application needs a name, valid email address, and phone number.".into(),
            );
        }
        if application.attachments.len() > 10 {
            return Err("An application can have at most 10 attachments.".into());
        }
        for attachment in &application.attachments {
            if attachment.id.is_empty()
                || attachment.id.contains('/')
                || attachment.id.contains('\\')
                || attachment.id.starts_with('.')
                || attachment.file_name.trim().is_empty()
                || attachment.size_bytes > MAX_MEMBER_ATTACHMENT_BYTES as u64
                || !["application/pdf", "image/jpeg", "image/png", "image/webp"]
                    .contains(&attachment.mime_type.as_str())
            {
                return Err("An application contains an invalid attachment.".into());
            }
        }
    }
    let mut member_emails = std::collections::HashSet::new();
    for member in &workspace.members {
        if member.full_name.trim().is_empty()
            || member.email.trim().is_empty()
            || !member.email.contains('@')
            || member.phone.trim().is_empty()
        {
            return Err("Each member needs a name, valid email address, and phone number.".into());
        }
        if !member_emails.insert(member.email.trim().to_lowercase()) {
            return Err("Member email addresses must be unique.".into());
        }
    }
    Ok(())
}

fn seed_content() -> Vec<ContentRecord> {
    let mut records = vec![ContentRecord {
        id: "company-profile".into(),
        kind: "company".into(),
        title: "KILIVO LABS".into(),
        summary: "Build. Innovate. Empower.".into(),
        body: "A forward-thinking organization committed to innovation, community impact, and empowering people through technology.".into(),
        status: "published".into(),
        image: None,
        division_id: None,
        logo_white: None,
        logo_blue: None,
        logo_variant: None,
        assignee: None,
        due_date: None,
        work_status: None,
        starts_at: None,
        location: None,
        resource_file_id: None,
        resource_file_name: None,
        resource_mime_type: None,
        resource_size_bytes: None,
        updated_at: timestamp(),
    }];

    for (id, title, summary, body) in [
        (
            "business",
            "KILIVO BUSINESS",
            "Commerce & More",
            "Commerce, trade, and business services.",
        ),
        (
            "technology",
            "KILIVO TECHNOLOGIES",
            "Tech for a Better World",
            "Innovative solutions, digital products, and IT services.",
        ),
        (
            "projects",
            "KILIVO PROJECTS",
            "Projects & Opportunities",
            "Manage and deliver projects and connect with opportunities.",
        ),
        (
            "impact",
            "KILIVO IMPACT",
            "Community & Hope",
            "Social development, charity, and community empowerment.",
        ),
    ] {
        records.push(ContentRecord {
            id: format!("division-{id}"),
            kind: "division".into(),
            title: title.into(),
            summary: summary.into(),
            body: body.into(),
            status: "published".into(),
            image: None,
            division_id: None,
            logo_white: None,
            logo_blue: None,
            logo_variant: None,
            assignee: None,
            due_date: None,
            work_status: None,
            starts_at: None,
            location: None,
            resource_file_id: None,
            resource_file_name: None,
            resource_mime_type: None,
            resource_size_bytes: None,
            updated_at: timestamp(),
        });
    }

    for (id, kind, title, summary, body) in [
        (
            "project-skills",
            "project",
            "Digital Skills Program",
            "Digital skills training and mentorship.",
            "A program to help community members develop practical digital skills.",
        ),
        (
            "project-office",
            "project",
            "KILIVO Office Upgrade",
            "Facilities and project delivery.",
            "An ongoing project to improve shared workspaces.",
        ),
        (
            "impact-education",
            "impact",
            "Education & Awareness",
            "Learning opportunities for young people.",
            "Community education and awareness activities.",
        ),
        (
            "impact-community",
            "impact",
            "Community Development",
            "Stronger, more resilient communities.",
            "Programs supporting local community development.",
        ),
        (
            "news-innovation",
            "news",
            "Innovation for a Better Tomorrow",
            "KILIVO LABS continues to drive innovation for social good.",
            "A new chapter of growth and opportunity.",
        ),
        (
            "news-impact",
            "news",
            "Community Impact in Action",
            "Together we are creating lasting change.",
            "Community partners came together to support local wellbeing.",
        ),
        (
            "news-milestone",
            "news",
            "KILIVO LABS New Milestone",
            "A new chapter of growth and opportunity.",
            "KILIVO LABS continues to build opportunities through technology and community programs.",
        ),
        (
            "page-about",
            "page",
            "About Us",
            "Who we are and what we do.",
            "Edit this page content for the public website.",
        ),
        (
            "page-contact",
            "page",
            "Contact",
            "Get in touch with KILIVO LABS.",
            "Edit contact and enquiry information for the public website.",
        ),
    ] {
        records.push(ContentRecord {
            id: id.into(),
            kind: kind.into(),
            title: title.into(),
            summary: summary.into(),
            body: body.into(),
            status: "draft".into(),
            image: None,
            division_id: match id {
                "project-skills" => Some("division-technology".into()),
                "project-office" => Some("division-projects".into()),
                "impact-education" | "impact-community" => Some("division-impact".into()),
                _ => None,
            },
            logo_white: None,
            logo_blue: None,
            logo_variant: None,
            assignee: None,
            due_date: None,
            work_status: None,
            starts_at: None,
            location: None,
            resource_file_id: None,
            resource_file_name: None,
            resource_mime_type: None,
            resource_size_bytes: None,
            updated_at: timestamp(),
        });
    }

    records.extend(worker_sample_records());
    records.push(announcement_seed());
    records
}

fn worker_sample_records() -> Vec<ContentRecord> {
    [
        ContentRecord {
            id: "assignment-community-workshop".into(),
            kind: "assignment".into(),
            title: "Community Skills Workshop".into(),
            summary: "Prepare the member training plan.".into(),
            body: "Coordinate the workshop plan and share progress with the division lead.".into(),
            status: "draft".into(),
            image: None,
            division_id: Some("division-impact".into()),
            logo_white: None,
            logo_blue: None,
            logo_variant: None,
            assignee: None,
            due_date: Some("2026-11-20".into()),
            work_status: Some("in_progress".into()),
            starts_at: None,
            location: None,
            resource_file_id: None,
            resource_file_name: None,
            resource_mime_type: None,
            resource_size_bytes: None,
            updated_at: timestamp(),
        },
        ContentRecord {
            id: "event-members-briefing".into(),
            kind: "event".into(),
            title: "Members Monthly Briefing".into(),
            summary: "Monthly briefing for company members.".into(),
            body: "Share division updates and upcoming priorities.".into(),
            status: "draft".into(),
            image: None,
            division_id: None,
            logo_white: None,
            logo_blue: None,
            logo_variant: None,
            assignee: None,
            due_date: None,
            work_status: None,
            starts_at: Some("2026-11-18T10:00".into()),
            location: Some("Main conference room · Hybrid".into()),
            resource_file_id: None,
            resource_file_name: None,
            resource_mime_type: None,
            resource_size_bytes: None,
            updated_at: timestamp(),
        },
        ContentRecord {
            id: "document-member-handbook".into(),
            kind: "document".into(),
            title: "Member Handbook".into(),
            summary: "Policies and company guidance.".into(),
            body: "Upload the current handbook file before publishing this resource to members."
                .into(),
            status: "draft".into(),
            image: None,
            division_id: None,
            logo_white: None,
            logo_blue: None,
            logo_variant: None,
            assignee: None,
            due_date: None,
            work_status: None,
            starts_at: None,
            location: None,
            resource_file_id: None,
            resource_file_name: None,
            resource_mime_type: None,
            resource_size_bytes: None,
            updated_at: timestamp(),
        },
    ]
    .into_iter()
    .collect()
}

fn migrate_records(records: &mut Vec<ContentRecord>, schema_version: u32) -> bool {
    if schema_version >= CONTENT_SCHEMA_VERSION {
        return false;
    }
    if schema_version < 1
        && !records
            .iter()
            .any(|record| record.id == "announcement-briefing")
    {
        records.push(announcement_seed());
    }
    if schema_version < 2 {
        for record in records
            .iter_mut()
            .filter(|record| record.division_id.is_none())
        {
            record.division_id = match record.id.as_str() {
                "project-skills" => Some("division-technology".into()),
                _ if record.kind == "project" => Some("division-projects".into()),
                _ if record.kind == "impact" => Some("division-impact".into()),
                _ => None,
            };
        }
    }
    if schema_version < 4 {
        for sample in worker_sample_records() {
            if !records.iter().any(|record| record.id == sample.id) {
                records.push(sample);
            }
        }
    }
    true
}

fn write_schema_version(app: &AppHandle) -> Result<(), String> {
    let path = data_dir(app)?.join("content-schema-version");
    let temporary_path = path.with_extension("tmp");
    let mut file = fs::File::create(&temporary_path)
        .map_err(|error| format!("Could not create content schema marker: {error}"))?;
    write!(file, "{CONTENT_SCHEMA_VERSION}")
        .map_err(|error| format!("Could not write content schema marker: {error}"))?;
    file.sync_all()
        .map_err(|error| format!("Could not sync content schema marker: {error}"))?;
    fs::rename(&temporary_path, path)
        .map_err(|error| format!("Could not save content schema marker: {error}"))
}

fn write_json_atomic(path: &Path, records: &[ContentRecord]) -> Result<(), String> {
    let temporary_path = path.with_extension("json.tmp");
    let bytes = serde_json::to_vec_pretty(records)
        .map_err(|error| format!("Could not encode local content: {error}"))?;
    let mut file = fs::File::create(&temporary_path)
        .map_err(|error| format!("Could not create local content file: {error}"))?;
    file.write_all(&bytes)
        .map_err(|error| format!("Could not write local content: {error}"))?;
    file.sync_all()
        .map_err(|error| format!("Could not sync local content: {error}"))?;
    fs::rename(&temporary_path, path)
        .map_err(|error| format!("Could not save local content: {error}"))
}

fn read_content(app: &AppHandle) -> Result<Vec<ContentRecord>, String> {
    let path = content_path(app)?;
    if !path.exists() {
        let records = seed_content();
        write_json_atomic(&path, &records)?;
        write_schema_version(app)?;
        return Ok(records);
    }

    let bytes =
        fs::read(&path).map_err(|error| format!("Could not read local content: {error}"))?;
    let mut records: Vec<ContentRecord> = serde_json::from_slice(&bytes)
        .map_err(|error| format!("Local content file is invalid: {error}"))?;
    let schema_path = data_dir(app)?.join("content-schema-version");
    let schema_version = if schema_path.exists() {
        let version = fs::read_to_string(&schema_path)
            .map_err(|error| format!("Could not read content schema marker: {error}"))?;
        version
            .trim()
            .parse::<u32>()
            .map_err(|error| format!("Content schema marker is invalid: {error}"))?
    } else {
        0
    };
    if migrate_records(&mut records, schema_version) {
        write_json_atomic(&path, &records)?;
        write_schema_version(app)?;
    }
    Ok(records)
}

fn cleanup_unused_uploads(app: &AppHandle, records: &[ContentRecord]) -> Result<(), String> {
    let upload_dir = data_dir(app)?.join("uploads");
    if !upload_dir.exists() {
        return Ok(());
    }
    let used_images: std::collections::HashSet<&str> = records
        .iter()
        .flat_map(|record| {
            [
                record.image.as_deref(),
                record.logo_white.as_deref(),
                record.logo_blue.as_deref(),
            ]
        })
        .flatten()
        .collect();
    for entry in fs::read_dir(&upload_dir)
        .map_err(|error| format!("Could not list uploaded images: {error}"))?
    {
        let entry =
            entry.map_err(|error| format!("Could not read uploaded image entry: {error}"))?;
        let filename = entry.file_name();
        if !used_images.contains(filename.to_string_lossy().as_ref()) {
            fs::remove_file(entry.path())
                .map_err(|error| format!("Could not remove unused uploaded image: {error}"))?;
        }
    }
    Ok(())
}

fn cleanup_unused_resource_files(app: &AppHandle, records: &[ContentRecord]) -> Result<(), String> {
    let resource_dir = data_dir(app)?.join("resource-files");
    if !resource_dir.exists() {
        return Ok(());
    }
    let used_files: std::collections::HashSet<&str> = records
        .iter()
        .filter_map(|record| record.resource_file_id.as_deref())
        .collect();
    for entry in fs::read_dir(&resource_dir)
        .map_err(|error| format!("Could not list resource files: {error}"))?
    {
        let entry =
            entry.map_err(|error| format!("Could not read resource file entry: {error}"))?;
        if !used_files.contains(entry.file_name().to_string_lossy().as_ref()) {
            fs::remove_file(entry.path())
                .map_err(|error| format!("Could not remove unused resource file: {error}"))?;
        }
    }
    Ok(())
}

fn validate_content_record(record: &ContentRecord) -> Result<(), String> {
    if record.kind == "assignment" {
        if !record
            .work_status
            .as_deref()
            .is_some_and(|status| ["not_started", "in_progress", "completed"].contains(&status))
        {
            return Err("Choose a valid assignment work status.".into());
        }
        if record
            .assignee
            .as_ref()
            .is_some_and(|value| value.len() > 180)
        {
            return Err("The assigned member value is too long.".into());
        }
        if record.status == "published"
            && !record
                .assignee
                .as_deref()
                .is_some_and(|assignee| assignee.contains('@'))
        {
            return Err("Choose an active member before publishing this assignment.".into());
        }
        if record.due_date.as_ref().is_some_and(|value| {
            !value.is_empty()
                && (value.len() != 10
                    || value.as_bytes().get(4) != Some(&b'-')
                    || value.as_bytes().get(7) != Some(&b'-'))
        }) {
            return Err("Enter a valid assignment due date.".into());
        }
    } else if record.assignee.is_some() || record.due_date.is_some() || record.work_status.is_some()
    {
        return Err("Assignment fields can only be saved for assignments.".into());
    }

    if record.kind == "event" {
        if record
            .starts_at
            .as_ref()
            .is_some_and(|value| value.len() > 40 || value.trim().is_empty())
            || record
                .location
                .as_ref()
                .is_some_and(|value| value.len() > 240)
        {
            return Err("Enter a valid event date and location.".into());
        }
        if record.status == "published" && record.starts_at.is_none() {
            return Err("Set the event date and time before publishing this event.".into());
        }
    } else if record.starts_at.is_some() || record.location.is_some() {
        return Err("Event fields can only be saved for events.".into());
    }

    let has_resource_metadata = record.resource_file_id.is_some()
        || record.resource_file_name.is_some()
        || record.resource_mime_type.is_some()
        || record.resource_size_bytes.is_some();
    if record.kind == "document" {
        match (
            record.resource_file_id.as_deref(),
            record.resource_file_name.as_deref(),
            record.resource_mime_type.as_deref(),
            record.resource_size_bytes,
        ) {
            (Some(id), Some(name), Some(mime), Some(size))
                if !id.is_empty()
                    && !id.contains('/')
                    && !id.contains('\\')
                    && !id.starts_with('.')
                    && !name.trim().is_empty()
                    && name.len() <= 180
                    && size > 0
                    && size <= MAX_RESOURCE_FILE_BYTES as u64
                    && [
                        "application/pdf",
                        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                        "application/vnd.openxmlformats-officedocument.presentationml.presentation",
                    ]
                    .contains(&mime) => {}
            (None, None, None, None) if record.status == "draft" => {}
            (None, None, None, None) => {
                return Err("Attach a resource file before publishing this document.".into());
            }
            _ => return Err("The document resource file details are invalid.".into()),
        }
    } else if has_resource_metadata {
        return Err("Resource file details can only be saved for documents.".into());
    }
    Ok(())
}

#[tauri::command]
fn load_content(
    app: AppHandle,
    lock: State<'_, ContentLock>,
) -> Result<Vec<ContentRecord>, String> {
    let _guard = lock
        .0
        .lock()
        .map_err(|_| "Content storage is unavailable.".to_string())?;
    read_content(&app)
}

#[tauri::command]
fn save_content(
    app: AppHandle,
    lock: State<'_, ContentLock>,
    mut record: ContentRecord,
) -> Result<ContentRecord, String> {
    let _guard = lock
        .0
        .lock()
        .map_err(|_| "Content storage is unavailable.".to_string())?;
    record.title = record.title.trim().to_string();
    record.summary = record.summary.trim().to_string();
    record.body = record.body.trim().to_string();
    if record.title.is_empty() {
        return Err("A title is required.".into());
    }
    if !CONTENT_KINDS.contains(&record.kind.as_str()) {
        return Err("This content type is not supported.".into());
    }
    if !["draft", "published"].contains(&record.status.as_str()) {
        return Err("Choose draft or published status.".into());
    }
    validate_content_record(&record)?;
    if record.logo_variant.is_some() && record.kind != "company" {
        return Err("A company logo can only be selected for the company profile.".into());
    }
    record.updated_at = timestamp();

    let path = content_path(&app)?;
    let mut records = read_content(&app)?;
    if record.division_id.is_some()
        && ![
            "project",
            "impact",
            "news",
            "announcement",
            "assignment",
            "event",
            "document",
        ]
        .contains(&record.kind.as_str())
    {
        return Err("Only division content can be associated with a division.".into());
    }
    if let Some(division_id) = record.division_id.as_deref() {
        if !records
            .iter()
            .any(|existing| existing.id == division_id && existing.kind == "division")
        {
            return Err("Choose an existing division for this content.".into());
        }
    }
    if let Some(resource_id) = record.resource_file_id.as_deref() {
        let resource_path = data_dir(&app)?.join("resource-files").join(resource_id);
        if !resource_path.is_file() {
            return Err("The attached resource file is missing from local storage.".into());
        }
        let bytes = fs::read(&resource_path)
            .map_err(|error| format!("Could not verify the attached resource file: {error}"))?;
        if Some(bytes.len() as u64) != record.resource_size_bytes
            || resource_file_extension(
                record.resource_mime_type.as_deref().unwrap_or_default(),
                &bytes,
            )
            .is_err()
        {
            return Err("The attached resource file does not match its stored details.".into());
        }
    }
    if let Some(existing) = records.iter_mut().find(|existing| existing.id == record.id) {
        *existing = record.clone();
    } else {
        records.push(record.clone());
    }
    write_json_atomic(&path, &records)?;
    cleanup_unused_uploads(&app, &records)?;
    cleanup_unused_resource_files(&app, &records)?;
    Ok(record)
}

#[tauri::command]
fn delete_content(app: AppHandle, lock: State<'_, ContentLock>, id: String) -> Result<(), String> {
    let _guard = lock
        .0
        .lock()
        .map_err(|_| "Content storage is unavailable.".to_string())?;
    let path = content_path(&app)?;
    let mut records = read_content(&app)?;
    let original_len = records.len();
    records.retain(|record| record.id != id);
    if records.len() == original_len {
        return Err("The content item no longer exists.".into());
    }
    write_json_atomic(&path, &records)?;
    cleanup_unused_uploads(&app, &records)?;
    cleanup_unused_resource_files(&app, &records)
}

#[tauri::command]
fn load_member_workspace(
    app: AppHandle,
    lock: State<'_, MemberLock>,
) -> Result<MemberWorkspaceData, String> {
    let _guard = lock
        .0
        .lock()
        .map_err(|_| "Member storage is unavailable.".to_string())?;
    read_member_workspace(&app)
}

#[tauri::command]
fn save_member_workspace(
    app: AppHandle,
    lock: State<'_, MemberLock>,
    workspace: MemberWorkspaceData,
) -> Result<MemberWorkspaceData, String> {
    let _guard = lock
        .0
        .lock()
        .map_err(|_| "Member storage is unavailable.".to_string())?;
    validate_member_workspace(&workspace)?;
    write_member_workspace(&app, &workspace)?;
    Ok(workspace)
}

#[tauri::command]
fn upload_member_attachment(
    app: AppHandle,
    lock: State<'_, MemberLock>,
    file_name: String,
    mime_type: String,
    base64_data: String,
) -> Result<MemberAttachment, String> {
    let _guard = lock
        .0
        .lock()
        .map_err(|_| "Member storage is unavailable.".to_string())?;
    if base64_data.len() > (MAX_MEMBER_ATTACHMENT_BYTES * 4 / 3) + 8 {
        return Err("Attachment size must be 10 MB or less.".into());
    }
    let bytes = STANDARD
        .decode(base64_data)
        .map_err(|_| "The selected attachment could not be decoded.".to_string())?;
    if bytes.is_empty() || bytes.len() > MAX_MEMBER_ATTACHMENT_BYTES {
        return Err("Attachment size must be between 1 byte and 10 MB.".into());
    }
    let extension = member_attachment_extension(&mime_type, &bytes)?;
    let id = format!("{}.{}", uuid::Uuid::new_v4(), extension);
    let file_name: String = file_name
        .chars()
        .filter(|character| !character.is_control() && *character != '/' && *character != '\\')
        .take(180)
        .collect();
    if file_name.trim().is_empty() {
        return Err("Attachment filename cannot be empty.".into());
    }
    let attachment_dir = data_dir(&app)?.join("member-attachments");
    fs::create_dir_all(&attachment_dir)
        .map_err(|error| format!("Could not create attachment folder: {error}"))?;
    fs::write(attachment_dir.join(&id), &bytes)
        .map_err(|error| format!("Could not save attachment: {error}"))?;
    Ok(MemberAttachment {
        id,
        file_name,
        mime_type,
        size_bytes: bytes.len() as u64,
    })
}

#[tauri::command]
fn load_member_attachment(
    app: AppHandle,
    lock: State<'_, MemberLock>,
    id: String,
) -> Result<MemberAttachmentPayload, String> {
    let _guard = lock
        .0
        .lock()
        .map_err(|_| "Member storage is unavailable.".to_string())?;
    if id.contains('/') || id.contains('\\') || id.starts_with('.') {
        return Err("Invalid attachment reference.".into());
    }
    let workspace = read_member_workspace(&app)?;
    let attachment = workspace
        .applications
        .iter()
        .flat_map(|application| &application.attachments)
        .find(|attachment| attachment.id == id)
        .ok_or_else(|| "The attachment is not associated with a saved application.".to_string())?;
    let path = data_dir(&app)?.join("member-attachments").join(&id);
    let bytes = fs::read(path).map_err(|error| format!("Could not read attachment: {error}"))?;
    Ok(MemberAttachmentPayload {
        file_name: attachment.file_name.clone(),
        mime_type: attachment.mime_type.clone(),
        base64_data: STANDARD.encode(bytes),
    })
}

fn image_extension(mime_type: &str, bytes: &[u8]) -> Result<&'static str, String> {
    match mime_type {
        "image/png" if bytes.starts_with(b"\x89PNG\r\n\x1a\n") => Ok("png"),
        "image/jpeg" if bytes.starts_with(&[0xFF, 0xD8, 0xFF]) => Ok("jpg"),
        "image/webp" if bytes.len() >= 12 && &bytes[..4] == b"RIFF" && &bytes[8..12] == b"WEBP" => {
            Ok("webp")
        }
        _ => Err("Choose a valid PNG, JPEG, or WebP image.".into()),
    }
}

fn member_attachment_extension(mime_type: &str, bytes: &[u8]) -> Result<&'static str, String> {
    match mime_type {
        "application/pdf" if bytes.starts_with(b"%PDF-") => Ok("pdf"),
        "image/jpeg" | "image/png" | "image/webp" => image_extension(mime_type, bytes),
        _ => Err("Choose a valid PDF, JPEG, PNG, or WebP attachment.".into()),
    }
}

fn resource_file_extension(mime_type: &str, bytes: &[u8]) -> Result<&'static str, String> {
    match mime_type {
        "application/pdf" if bytes.starts_with(b"%PDF-") => Ok("pdf"),
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            if bytes.starts_with(b"PK\x03\x04") =>
        {
            Ok("docx")
        }
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            if bytes.starts_with(b"PK\x03\x04") =>
        {
            Ok("xlsx")
        }
        "application/vnd.openxmlformats-officedocument.presentationml.presentation"
            if bytes.starts_with(b"PK\x03\x04") =>
        {
            Ok("pptx")
        }
        _ => Err("Choose a valid PDF, DOCX, XLSX, or PPTX resource.".into()),
    }
}

fn safe_resource_file_name(file_name: &str) -> Result<String, String> {
    let safe_name: String = file_name
        .chars()
        .filter(|character| !character.is_control() && *character != '/' && *character != '\\')
        .take(180)
        .collect();
    if safe_name.trim().is_empty() {
        return Err("Resource filename cannot be empty.".into());
    }
    Ok(safe_name)
}

#[tauri::command]
fn upload_resource_file(
    app: AppHandle,
    lock: State<'_, ContentLock>,
    file_name: String,
    mime_type: String,
    base64_data: String,
) -> Result<ResourceFileMetadata, String> {
    let _guard = lock
        .0
        .lock()
        .map_err(|_| "Content storage is unavailable.".to_string())?;
    if base64_data.len() > (MAX_RESOURCE_FILE_BYTES * 4 / 3) + 8 {
        return Err("Resource files must be 10 MB or less.".into());
    }
    let bytes = STANDARD
        .decode(base64_data)
        .map_err(|_| "The selected resource could not be decoded.".to_string())?;
    if bytes.is_empty() || bytes.len() > MAX_RESOURCE_FILE_BYTES {
        return Err("Resource files must be between 1 byte and 10 MB.".into());
    }
    let extension = resource_file_extension(&mime_type, &bytes)?;
    let file_name = safe_resource_file_name(&file_name)?;
    let id = format!("{}.{}", uuid::Uuid::new_v4(), extension);
    let resource_dir = data_dir(&app)?.join("resource-files");
    fs::create_dir_all(&resource_dir)
        .map_err(|error| format!("Could not create resource folder: {error}"))?;
    fs::write(resource_dir.join(&id), &bytes)
        .map_err(|error| format!("Could not save resource file: {error}"))?;
    Ok(ResourceFileMetadata {
        id,
        file_name,
        mime_type,
        size_bytes: bytes.len() as u64,
    })
}

#[tauri::command]
fn load_resource_file(
    app: AppHandle,
    lock: State<'_, ContentLock>,
    id: String,
) -> Result<ResourceFilePayload, String> {
    let _guard = lock
        .0
        .lock()
        .map_err(|_| "Content storage is unavailable.".to_string())?;
    if id.contains('/') || id.contains('\\') || id.starts_with('.') {
        return Err("Invalid resource file reference.".into());
    }
    let record = read_content(&app)?
        .into_iter()
        .find(|record| {
            record.kind == "document" && record.resource_file_id.as_deref() == Some(id.as_str())
        })
        .ok_or_else(|| "The resource file is not associated with a saved document.".to_string())?;
    let file_name = record
        .resource_file_name
        .ok_or_else(|| "The saved document is missing its filename.".to_string())?;
    let mime_type = record
        .resource_mime_type
        .ok_or_else(|| "The saved document is missing its file type.".to_string())?;
    let size_bytes = record
        .resource_size_bytes
        .ok_or_else(|| "The saved document is missing its file size.".to_string())?;
    let path = data_dir(&app)?.join("resource-files").join(&id);
    let bytes = fs::read(path).map_err(|error| format!("Could not read resource file: {error}"))?;
    if bytes.len() as u64 != size_bytes || resource_file_extension(&mime_type, &bytes).is_err() {
        return Err("The saved resource file does not match its stored details.".into());
    }
    Ok(ResourceFilePayload {
        id,
        file_name,
        mime_type,
        size_bytes,
        base64_data: STANDARD.encode(bytes),
    })
}

#[tauri::command]
fn upload_image(
    app: AppHandle,
    lock: State<'_, ContentLock>,
    mime_type: String,
    base64_data: String,
) -> Result<String, String> {
    let _guard = lock
        .0
        .lock()
        .map_err(|_| "Content storage is unavailable.".to_string())?;
    if base64_data.len() > (MAX_IMAGE_BYTES * 4 / 3) + 8 {
        return Err("Image size must be 10 MB or less.".into());
    }
    let bytes = STANDARD
        .decode(base64_data)
        .map_err(|_| "The selected image could not be decoded.".to_string())?;
    if bytes.is_empty() || bytes.len() > MAX_IMAGE_BYTES {
        return Err("Image size must be between 1 byte and 10 MB.".into());
    }
    let extension = image_extension(&mime_type, &bytes)?;
    let filename = format!("{}.{}", uuid::Uuid::new_v4(), extension);
    let upload_dir = data_dir(&app)?.join("uploads");
    fs::create_dir_all(&upload_dir)
        .map_err(|error| format!("Could not create image folder: {error}"))?;
    fs::write(upload_dir.join(&filename), bytes)
        .map_err(|error| format!("Could not save uploaded image: {error}"))?;
    Ok(filename)
}

#[tauri::command]
fn load_image(app: AppHandle, filename: String) -> Result<Option<String>, String> {
    if filename.contains('/') || filename.contains('\\') || filename.starts_with('.') {
        return Err("Invalid image reference.".into());
    }
    let (mime_type, extension) = match filename.rsplit_once('.') {
        Some((_, "png")) => ("image/png", "png"),
        Some((_, "jpg")) => ("image/jpeg", "jpg"),
        Some((_, "webp")) => ("image/webp", "webp"),
        _ => return Err("Unsupported image reference.".into()),
    };
    if extension.is_empty() {
        return Err("Invalid image reference.".into());
    }
    let path = data_dir(&app)?.join("uploads").join(filename);
    if !path.exists() {
        return Ok(None);
    }
    let bytes =
        fs::read(path).map_err(|error| format!("Could not read uploaded image: {error}"))?;
    Ok(Some(format!(
        "{mime_type};base64,{}",
        STANDARD.encode(bytes)
    )))
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .manage(ContentLock(Mutex::new(())))
        .manage(MemberLock(Mutex::new(())))
        .invoke_handler(tauri::generate_handler![
            load_content,
            save_content,
            delete_content,
            upload_image,
            load_image,
            load_member_workspace,
            save_member_workspace,
            upload_member_attachment,
            load_member_attachment,
            upload_resource_file,
            load_resource_file,
        ])
        .run(tauri::generate_context!())
        .expect("error while running Tauri application");
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn member_workspace_starts_with_labeled_mock_applications_and_approved_members() {
        let workspace = seed_member_workspace();

        assert_eq!(workspace.applications.len(), 5);
        assert_eq!(workspace.members.len(), 2);
        assert!(
            workspace
                .applications
                .iter()
                .filter(|application| application.status == ApplicationStatus::Pending)
                .count()
                > 0
        );
        assert!(
            workspace
                .members
                .iter()
                .all(|member| member.invitation_status == "mock_not_sent")
        );
        validate_member_workspace(&workspace).expect("sample member data should be valid");
    }

    #[test]
    fn member_workspace_rejects_duplicate_member_emails() {
        let mut workspace = seed_member_workspace();
        let mut duplicate = workspace.members[0].clone();
        duplicate.id = "duplicate-member".into();
        workspace.members.push(duplicate);

        assert!(validate_member_workspace(&workspace).is_err());
    }

    #[test]
    fn image_upload_accepts_only_matching_supported_mime_and_signature() {
        assert_eq!(
            image_extension("image/png", b"\x89PNG\r\n\x1a\nrest"),
            Ok("png")
        );
        assert_eq!(
            image_extension("image/jpeg", &[0xFF, 0xD8, 0xFF, 0x00]),
            Ok("jpg")
        );
        assert_eq!(
            image_extension("image/webp", b"RIFF0000WEBPdata"),
            Ok("webp")
        );
        assert!(image_extension("image/png", b"not an image").is_err());
        assert!(image_extension("image/svg+xml", b"<svg/>").is_err());
    }

    #[test]
    fn member_attachments_accept_only_matching_pdf_and_image_signatures() {
        assert_eq!(
            member_attachment_extension("application/pdf", b"%PDF-1.7 data"),
            Ok("pdf")
        );
        assert_eq!(
            member_attachment_extension("image/png", b"\x89PNG\r\n\x1a\nrest"),
            Ok("png")
        );
        assert!(member_attachment_extension("application/pdf", b"not a pdf").is_err());
        assert!(member_attachment_extension("text/html", b"<html>").is_err());
    }

    #[test]
    fn resource_upload_accepts_only_supported_files_with_matching_signatures() {
        assert_eq!(
            resource_file_extension("application/pdf", b"%PDF-1.7 data"),
            Ok("pdf")
        );
        assert_eq!(
            resource_file_extension(
                "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                b"PK\x03\x04data"
            ),
            Ok("docx")
        );
        assert!(resource_file_extension("application/pdf", b"not a pdf").is_err());
        assert!(resource_file_extension("text/html", b"<html>").is_err());
    }

    #[test]
    fn worker_content_requires_member_event_date_and_document_before_publishing() {
        let mut assignment = worker_sample_records().remove(0);
        assignment.status = "published".into();
        assert!(validate_content_record(&assignment).is_err());
        assignment.assignee = Some("member@example.test".into());
        validate_content_record(&assignment).expect("a member assignment should be valid");

        let mut event = worker_sample_records().remove(1);
        event.status = "published".into();
        event.starts_at = None;
        assert!(validate_content_record(&event).is_err());
        event.starts_at = Some("2026-11-18T10:00".into());
        validate_content_record(&event).expect("a scheduled event should be valid");

        let mut document = worker_sample_records().remove(2);
        document.status = "published".into();
        assert!(validate_content_record(&document).is_err());
        document.resource_file_id = Some("resource.pdf".into());
        document.resource_file_name = Some("Member Handbook.pdf".into());
        document.resource_mime_type = Some("application/pdf".into());
        document.resource_size_bytes = Some(128);
        validate_content_record(&document).expect("a document with a file should be valid");
    }

    #[test]
    fn content_json_is_written_atomically_and_can_be_read_back() {
        let directory = std::env::temp_dir().join(format!("kilivo-admin-{}", uuid::Uuid::new_v4()));
        fs::create_dir_all(&directory).expect("create isolated test directory");
        let path = directory.join("content.json");
        let mut records = seed_content();
        records[0].logo_variant = Some(LogoVariant::Blue);

        write_json_atomic(&path, &records).expect("write content JSON");

        let bytes = fs::read(&path).expect("read content JSON");
        let loaded: Vec<ContentRecord> =
            serde_json::from_slice(&bytes).expect("decode content JSON");
        assert_eq!(loaded.len(), records.len());
        assert_eq!(loaded[0].id, "company-profile");
        assert_eq!(loaded[0].logo_variant, Some(LogoVariant::Blue));
        assert!(!directory.join("content.json.tmp").exists());

        fs::remove_dir_all(directory).expect("remove isolated test directory");
    }

    #[test]
    fn content_migration_adds_announcement_once_without_restoring_deleted_content() {
        let mut existing = seed_content();
        existing.retain(|record| record.id != "announcement-briefing");
        assert!(migrate_records(&mut existing, 0));
        assert!(
            existing
                .iter()
                .any(|record| record.id == "announcement-briefing")
        );

        existing.retain(|record| record.id != "announcement-briefing");
        assert!(!migrate_records(&mut existing, CONTENT_SCHEMA_VERSION));
        assert!(
            existing
                .iter()
                .all(|record| record.id != "announcement-briefing")
        );
    }

    #[test]
    fn content_migration_assigns_seed_projects_and_impact_to_their_divisions() {
        let mut existing = seed_content();
        for record in &mut existing {
            record.division_id = None;
        }

        assert!(migrate_records(&mut existing, 1));
        assert_eq!(
            existing
                .iter()
                .find(|record| record.id == "project-skills")
                .and_then(|record| record.division_id.as_deref()),
            Some("division-technology")
        );
        assert_eq!(
            existing
                .iter()
                .find(|record| record.id == "project-office")
                .and_then(|record| record.division_id.as_deref()),
            Some("division-projects")
        );
        assert_eq!(
            existing
                .iter()
                .find(|record| record.id == "impact-education")
                .and_then(|record| record.division_id.as_deref()),
            Some("division-impact")
        );
    }

    #[test]
    fn content_migration_adds_worker_workspace_examples_once() {
        let mut records = vec![];
        assert!(migrate_records(&mut records, 3));
        assert!(records.iter().any(|record| record.kind == "assignment"));
        assert!(records.iter().any(|record| record.kind == "event"));
        assert!(records.iter().any(|record| record.kind == "document"));

        records.retain(|record| record.kind != "event");
        assert!(!migrate_records(&mut records, CONTENT_SCHEMA_VERSION));
        assert!(!records.iter().any(|record| record.kind == "event"));
    }

    #[test]
    fn old_content_records_load_with_optional_fields_empty() {
        let bytes = br#"{"id":"old-page","kind":"page","title":"About","summary":"","body":"","status":"draft","image":null,"updatedAt":"1"}"#;
        let record: ContentRecord =
            serde_json::from_slice(bytes).expect("decode old content record");
        assert_eq!(record.division_id, None);
        assert_eq!(record.logo_white, None);
        assert_eq!(record.logo_blue, None);
        assert_eq!(record.logo_variant, None);
        assert_eq!(record.assignee, None);
        assert_eq!(record.due_date, None);
        assert_eq!(record.work_status, None);
        assert_eq!(record.starts_at, None);
        assert_eq!(record.location, None);
        assert_eq!(record.resource_file_id, None);
        assert_eq!(record.resource_file_name, None);
        assert_eq!(record.resource_mime_type, None);
        assert_eq!(record.resource_size_bytes, None);
    }
}
