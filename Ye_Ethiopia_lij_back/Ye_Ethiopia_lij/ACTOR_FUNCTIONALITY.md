# Actor Functionality & Workflows - Ye Ethiopia Lij

## Complete Actor Workflows

### 1. INDIVIDUAL SPONSOR Workflow

#### Registration & Login
```
1. Register Account
   POST /api/accounts/register/
   - Email, Name, Password
   - Role: SPONSOR
   - Status: PENDING (awaiting admin approval)

2. Wait for Admin Approval
   - Admin reviews and approves
   - Status changes to ACTIVE

3. Login
   POST /api/accounts/login/
   - Email, Password
   - Receive JWT tokens
```

#### Browse & Sponsor
```
1. Browse Published Profiles
   GET /api/childs/list/?gender=MALE&location=Addis%20Ababa
   - View all published children
   - Filter by location, gender, age
   - Search by name
   - View child details, photos, biography

2. View Child Details
   GET /api/childs/{child_id}/
   - Full child information
   - Guardian details
   - Vulnerability status
   - Academic history

3. Sponsor a Child
   POST /api/childs/sponsor/{child_id}/
   {
     "commitment_amount": 100.00
   }
   - Set monthly commitment
   - Confirm sponsorship
   - Receive confirmation

4. Track Sponsorship
   GET /api/childs/sponsorships/
   - View all sponsored children
   - View commitment details
   - Track payment history
   - View child progress
```

#### Monitor Progress
```
1. View Academic Reports
   GET /api/acadamicreport/results/?child={child_id}
   - View grades and scores
   - Track attendance
   - Read teacher comments
   - Monitor progress

2. Receive Updates
   - Automatic notifications
   - Academic report updates
   - Intervention updates
   - Child progress photos
```

#### Permissions
```
✅ Browse published profiles
✅ Sponsor children
✅ View academic reports
✅ Track sponsorship
✅ Change own password
❌ Register children
❌ Approve profiles
❌ Manage users
```

---

### 2. SCHOOLS Workflow

#### Registration & Setup
```
1. Register School Account
   POST /api/accounts/register/
   - School name, Email, Contact
   - Role: SCHOOL
   - Status: PENDING

2. Admin Approval
   - Admin verifies school
   - Status changes to ACTIVE

3. Login
   POST /api/accounts/login/
   - Email, Password
   - Receive JWT tokens
```

#### Submit Academic Reports
```
1. View Enrolled Children
   GET /api/childs/list/
   - See all children in school
   - Filter by grade, status
   - Search by name

2. Submit Academic Report
   POST /api/acadamicreport/results/
   {
     "child": "{child_id}",
     "school_name": "ABC School",
     "academic_year": "2024",
     "term": "TERM_1",
     "grade_level": "Grade 5",
     "average_score": 85.50,
     "rank": 3,
     "attendance_rate": 95.00,
     "report_card_image": <file>,
     "teacher_comments": "Excellent student"
   }
   - Upload report card image
   - Add teacher comments
   - Submit for record

3. Update Report
   PUT /api/acadamicreport/results/{report_id}/
   - Modify grades if needed
   - Update attendance
   - Add additional comments
   - Re-upload documents

4. View Submitted Reports
   GET /api/acadamicreport/results/my_reports/
   - See all submitted reports
   - Track submission history
   - View feedback
```

#### Record Interventions
```
1. Create Intervention Record
   POST /api/childs/interventions/
   {
     "child": "{child_id}",
     "type": "HEALTH",
     "description": "Medical checkup and vaccination",
     "date_provided": "2024-01-01",
     "receipt_image": <file>
   }
   - Record healthcare provided
   - Upload receipt/proof
   - Document details

2. Update Intervention
   PUT /api/childs/interventions/{intervention_id}/
   - Modify details
   - Update status
   - Add notes

3. View Interventions
   GET /api/childs/interventions/?child={child_id}
   - See all interventions
   - Track assistance provided
   - View history
```

#### Permissions
```
✅ Submit academic reports
✅ Update reports
✅ Create interventions
✅ View enrolled children
✅ Change own password
❌ Register children
❌ Approve profiles
❌ Manage users
❌ Sponsor children
```

---

### 3. ORPHANAGES Workflow

#### Registration & Setup
```
1. Register Organization
   POST /api/accounts/register/
   - Organization name, Email, Contact
   - Role: ORG_STAFF
   - Status: PENDING

2. Admin Approval
   - Admin verifies organization
   - Status changes to ACTIVE

3. Login
   POST /api/accounts/login/
   - Email, Password
   - Receive JWT tokens
```

#### Register Children
```
1. Submit Child Profile
   POST /api/childs/register/
   {
     "full_name": "Abebe Kebede",
     "age": 10,
     "gender": "MALE",
     "location": "Addis Ababa",
     "biography": "Abebe is a bright student...",
     "vulnerability_status": "orphan",
     "guardian_info": "Grandmother, Phone: 0911234567",
     "photo": <file>,
     "supporting_docs": <file>
   }
   - Upload child photo
   - Upload supporting documents
   - Provide background info
   - Status: PENDING

2. Track Submission Status
   GET /api/childs/{child_id}/
   - View profile status
   - See admin feedback
   - Track approval progress

3. Receive Approval/Rejection
   - Admin reviews profile
   - Status changes to PUBLISHED or REJECTED
   - Receive notification
   - If rejected, can resubmit

4. Profile Published
   - Child visible to sponsors
   - Can receive sponsorship
   - Tracked in system
```

#### Manage Interventions
```
1. Create Intervention
   POST /api/childs/interventions/
   {
     "child": "{child_id}",
     "type": "NUTRITION",
     "description": "Food assistance provided",
     "date_provided": "2024-01-01",
     "receipt_image": <file>
   }
   - Record aid provided
   - Upload receipt
   - Document details

2. Update Intervention
   PUT /api/childs/interventions/{intervention_id}/
   - Modify details
   - Update status
   - Add notes

3. View Interventions
   GET /api/childs/interventions/
   - See all interventions
   - Track assistance
   - View history
```

#### Receive Sponsorship
```
1. Get Sponsorship Notification
   - Child is sponsored
   - Receive sponsor details
   - Get commitment amount

2. Coordinate with Sponsor
   - Provide updates
   - Send progress reports
   - Coordinate assistance
   - Track relationship
```

#### Monitor Program
```
1. View Program Statistics
   GET /api/childs/list/
   - See all registered children
   - View sponsorship status
   - Track progress

2. Generate Reports
   - Child welfare reports
   - Intervention summaries
   - Progress tracking
   - Impact assessment
```

#### Permissions
```
✅ Register children
✅ Track submission status
✅ Create interventions
✅ Update interventions
✅ View interventions
✅ Monitor program
✅ Change own password
❌ Approve profiles
❌ Manage users
❌ Sponsor children
❌ Submit academic reports
```

---

### 4. RELIGION BASED INSTITUTIONS Workflow

Same as Orphanages (ORG_STAFF role)

#### Additional Responsibilities
```
✅ Register vulnerable children
✅ Provide spiritual guidance documentation
✅ Track faith-based interventions
✅ Coordinate with community
✅ Monitor welfare
```

---

### 5. NGOs Workflow

Same as Orphanages (ORG_STAFF role)

#### Additional Responsibilities
```
✅ Register children in need
✅ Provide comprehensive support
✅ Track multiple intervention types
✅ Coordinate with partners
✅ Generate impact reports
```

---

### 6. PROJECT MANAGER Workflow

#### Registration & Setup
```
1. Admin Account Created
   - Email, Name, Password
   - Role: ADMIN
   - Status: ACTIVE (automatic)

2. Login
   POST /api/accounts/login/
   - Email, Password
   - Receive JWT tokens
```

#### Manage User Accounts
```
1. View All Users
   GET /api/accounts/manage/
   - See all registered users
   - Filter by role, status
   - Search by email/name

2. Change User Status
   POST /api/accounts/manage/{user_id}/change-status/
   {
     "status": "ACTIVE"
   }
   - Approve pending users
   - Suspend problematic users
   - Reject applications
   - Reactivate users

3. Reset Password
   POST /api/accounts/manage/change-password/
   - Help users reset passwords
   - Manage access
```

#### Review & Approve Profiles
```
1. View All Child Profiles
   GET /api/childs/list/
   - See all submitted profiles
   - Filter by status (PENDING, PUBLISHED, SPONSORED)
   - Search by name, location

2. Review Profile Details
   GET /api/childs/{child_id}/
   - View complete information
   - Check documents
   - Review photos
   - Verify details

3. Approve Profile
   PUT /api/childs/{child_id}/
   {
     "status": "PUBLISHED"
   }
   - Verify information
   - Check for duplicates
   - Approve for sponsorship
   - Publish to sponsors

4. Reject Profile
   PUT /api/childs/{child_id}/
   {
     "status": "REJECTED"
   }
   - Request additional info
   - Provide feedback
   - Send notification
   - Allow resubmission

5. Send Notifications
   - Approval notifications
   - Rejection with reasons
   - Request for more info
   - Status updates
```

#### Resolve Duplicates
```
1. Identify Duplicates
   - System alerts on similar profiles
   - Review potential duplicates
   - Compare information

2. Merge Records
   - Consolidate duplicate entries
   - Keep primary record
   - Archive duplicates
   - Prevent duplicate sponsorship

3. Maintain Data Integrity
   - Verify uniqueness
   - Update references
   - Track changes
```

#### Review Financial Documents
```
1. View Financial Records
   GET /api/childs/sponsorships/
   - See all sponsorships
   - View commitment amounts
   - Track payments

2. Verify Documents
   - Review sponsorship agreements
   - Verify commitment amounts
   - Approve financial records
   - Track compliance

3. Generate Reports
   - Financial summaries
   - Sponsorship reports
   - Payment tracking
   - Compliance reports
```

#### Monitor Program
```
1. View Program Statistics
   - Total children registered
   - Sponsored vs. unsponsored
   - Intervention statistics
   - Academic performance

2. Generate Reports
   - Program impact reports
   - Child welfare reports
   - Intervention summaries
   - Performance metrics
```

#### Permissions
```
✅ Manage all users
✅ Change user status
✅ View all profiles
✅ Approve/reject profiles
✅ Resolve duplicates
✅ Review financial documents
✅ Monitor program
✅ Generate reports
✅ Change own password
✅ Delete profiles
```

---

### 7. SYSTEM ADMINISTRATOR Workflow

Same as Project Manager (ADMIN role)

#### Additional Responsibilities
```
✅ System configuration
✅ Database management
✅ Backup & recovery
✅ Security monitoring
✅ Performance optimization
✅ Log management
✅ User support
✅ System maintenance
```

#### System Maintenance Tasks
```
1. Monitor System Health
   - Check logs
   - Monitor performance
   - Track errors
   - Review security events

2. Manage Database
   - Backup database
   - Verify backups
   - Optimize queries
   - Maintain indexes

3. Security Management
   - Review audit logs
   - Monitor failed logins
   - Check for suspicious activity
   - Update security settings

4. User Support
   - Reset passwords
   - Unlock accounts
   - Resolve issues
   - Provide assistance
```

---

### 8. GOVERNMENT BODY Workflow

#### Registration & Setup
```
1. Register Government Account
   POST /api/accounts/register/
   - Department name, Email, Contact
   - Role: GOVERNMENT
   - Status: PENDING

2. Admin Approval
   - Admin verifies government body
   - Status changes to ACTIVE

3. Login
   POST /api/accounts/login/
   - Email, Password
   - Receive JWT tokens
```

#### Monitor Program
```
1. View Program Statistics
   GET /api/childs/list/
   - Total children registered
   - Sponsorship status
   - Geographic distribution
   - Vulnerability breakdown

2. View Academic Reports
   GET /api/acadamicreport/results/
   - Academic performance
   - Attendance rates
   - Grade distribution
   - Progress trends

3. View Interventions
   GET /api/childs/interventions/
   - Intervention types
   - Assistance provided
   - Coverage statistics
   - Impact metrics

4. Generate Reports
   - Program impact reports
   - Child welfare reports
   - Intervention summaries
   - Compliance reports
   - Performance metrics
```

#### Compliance Monitoring
```
1. Verify Compliance
   - Check program standards
   - Monitor quality
   - Track outcomes
   - Ensure accountability

2. Generate Compliance Reports
   - Compliance status
   - Issues identified
   - Recommendations
   - Follow-up actions
```

#### Permissions
```
✅ View all profiles
✅ View academic reports
✅ View interventions
✅ Monitor program
✅ Generate reports
✅ Change own password
❌ Approve profiles
❌ Manage users
❌ Register children
❌ Sponsor children
❌ Submit reports
```

---

### 9. AUTOMATED SYSTEM Workflow

#### Duplication Detection
```
1. Trigger on Child Registration
   - New profile submitted
   - System automatically checks

2. Compare with Existing Records
   - Similar names
   - Same location
   - Same age (±1 year)
   - Same guardian
   - Same vulnerability status

3. Alert Administrator
   - If duplicates found
   - Provide comparison
   - Suggest merge
   - Flag for review

4. Prevent Duplicate Sponsorship
   - Block duplicate registration
   - Merge records
   - Maintain data integrity
```

#### Implementation
```python
# Triggered on POST /api/childs/register/
# Checks:
- Levenshtein distance on names
- Exact location match
- Age within 1 year
- Guardian name similarity
- Vulnerability status match

# If match found:
- Alert admin
- Flag profile
- Suggest merge
- Prevent duplicate sponsorship
```

---

## Complete Permission Matrix

| Feature | SPONSOR | ORG_STAFF | SCHOOL | ADMIN | GOVERNMENT |
|---------|---------|-----------|--------|-------|------------|
| **Authentication** |
| Register | ✅ | ✅ | ✅ | ✅ | ✅ |
| Login | ✅ | ✅ | ✅ | ✅ | ✅ |
| Change Password | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Child Profiles** |
| Browse Profiles | ✅ | ✅ | ✅ | ✅ | ✅ |
| Register Child | ❌ | ✅ | ❌ | ✅ | ❌ |
| View Details | ✅ | ✅ | ✅ | ✅ | ✅ |
| Update Profile | ❌ | ✅ | ❌ | ✅ | ❌ |
| Delete Profile | ❌ | ❌ | ❌ | ✅ | ❌ |
| **Sponsorship** |
| Sponsor Child | ✅ | ❌ | ❌ | ❌ | ❌ |
| View Sponsorships | ✅ | ✅ | ❌ | ✅ | ❌ |
| Track Sponsorship | ✅ | ✅ | ❌ | ✅ | ❌ |
| **Academic Reports** |
| Submit Report | ❌ | ❌ | ✅ | ✅ | ❌ |
| Update Report | ❌ | ❌ | ✅ | ✅ | ❌ |
| View Reports | ✅ | ✅ | ✅ | ✅ | ✅ |
| Delete Report | ❌ | ❌ | ❌ | ✅ | ❌ |
| **Interventions** |
| Create Intervention | ❌ | ✅ | ✅ | ✅ | ❌ |
| Update Intervention | ❌ | ✅ | ✅ | ✅ | ❌ |
| View Interventions | ✅ | ✅ | ✅ | ✅ | ✅ |
| Delete Intervention | ❌ | ❌ | ❌ | ✅ | ❌ |
| **User Management** |
| View Users | ❌ | ❌ | ❌ | ✅ | ❌ |
| Create User | ❌ | ❌ | ❌ | ✅ | ❌ |
| Change Status | ❌ | ❌ | ❌ | ✅ | ❌ |
| Reset Password | ❌ | ❌ | ❌ | ✅ | ❌ |
| **Approval** |
| Approve Profile | ❌ | ❌ | ❌ | ✅ | ❌ |
| Reject Profile | ❌ | ❌ | ❌ | ✅ | ❌ |
| Resolve Duplicates | ❌ | ❌ | ❌ | ✅ | ❌ |
| **Reporting** |
| View Reports | ✅ | ✅ | ✅ | ✅ | ✅ |
| Generate Reports | ❌ | ✅ | ❌ | ✅ | ✅ |
| Monitor Program | ❌ | ✅ | ❌ | ✅ | ✅ |

---

## API Endpoint Access by Role

### SPONSOR
```
Authentication:
  POST   /api/accounts/register/
  POST   /api/accounts/login/
  POST   /api/accounts/login/refresh/
  POST   /api/accounts/manage/change-password/

Child Profiles:
  GET    /api/childs/list/
  GET    /api/childs/{id}/

Sponsorship:
  POST   /api/childs/sponsor/{child_id}/
  GET    /api/childs/sponsorships/

Academic Reports:
  GET    /api/acadamicreport/results/
  GET    /api/acadamicreport/results/{id}/
```

### ORG_STAFF
```
Authentication:
  POST   /api/accounts/register/
  POST   /api/accounts/login/
  POST   /api/accounts/login/refresh/
  POST   /api/accounts/manage/change-password/

Child Profiles:
  POST   /api/childs/register/
  GET    /api/childs/list/
  GET    /api/childs/{id}/
  PUT    /api/childs/{id}/

Interventions:
  POST   /api/childs/interventions/
  GET    /api/childs/interventions/
  GET    /api/childs/interventions/{id}/
  PUT    /api/childs/interventions/{id}/
  DELETE /api/childs/interventions/{id}/
```

### SCHOOL
```
Authentication:
  POST   /api/accounts/register/
  POST   /api/accounts/login/
  POST   /api/accounts/login/refresh/
  POST   /api/accounts/manage/change-password/

Academic Reports:
  POST   /api/acadamicreport/results/
  GET    /api/acadamicreport/results/
  GET    /api/acadamicreport/results/{id}/
  GET    /api/acadamicreport/results/my_reports/
  PUT    /api/acadamicreport/results/{id}/

Interventions:
  POST   /api/childs/interventions/
  GET    /api/childs/interventions/
  GET    /api/childs/interventions/{id}/
  PUT    /api/childs/interventions/{id}/
  DELETE /api/childs/interventions/{id}/
```

### ADMIN
```
Authentication:
  POST   /api/accounts/register/
  POST   /api/accounts/login/
  POST   /api/accounts/login/refresh/
  POST   /api/accounts/manage/change-password/

User Management:
  GET    /api/accounts/manage/
  POST   /api/accounts/manage/{id}/change-status/

Child Profiles:
  GET    /api/childs/list/
  GET    /api/childs/{id}/
  PUT    /api/childs/{id}/
  DELETE /api/childs/{id}/

Academic Reports:
  GET    /api/acadamicreport/results/
  GET    /api/acadamicreport/results/{id}/
  DELETE /api/acadamicreport/results/{id}/

Interventions:
  GET    /api/childs/interventions/
  GET    /api/childs/interventions/{id}/
  DELETE /api/childs/interventions/{id}/
```

### GOVERNMENT
```
Authentication:
  POST   /api/accounts/register/
  POST   /api/accounts/login/
  POST   /api/accounts/login/refresh/
  POST   /api/accounts/manage/change-password/

Child Profiles:
  GET    /api/childs/list/
  GET    /api/childs/{id}/

Academic Reports:
  GET    /api/acadamicreport/results/
  GET    /api/acadamicreport/results/{id}/

Interventions:
  GET    /api/childs/interventions/
  GET    /api/childs/interventions/{id}/
```

---

**Last Updated**: 2024
**Status**: ✅ ALL ACTORS & USE CASES IMPLEMENTED
