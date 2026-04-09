# Use Cases & Actor Functionality - Ye Ethiopia Lij

## System Actors

Based on the use case diagram, here are all actors and their complete functionality:

### 1. Individual Sponsor ✅
**Role**: SPONSOR

#### Functionality
- **Browse Approved Child Profiles** (UC-12)
  - View list of published child profiles
  - Filter by location, gender, age
  - Search by name
  - View child details and photos

- **Sponsor a Child** (UC-13)
  - Select a child to sponsor
  - Set commitment amount
  - Confirm sponsorship
  - Receive sponsorship confirmation

- **Track Sponsorship History** (UC-14)
  - View list of sponsored children
  - View sponsorship details
  - Track commitment payments
  - View child progress reports

- **View Child Academic Status** (UC-15)
  - View academic reports
  - Track grades and attendance
  - View teacher comments
  - Monitor academic progress

- **Receive Sponsorship Updates**
  - Get notifications on child progress
  - Receive academic reports
  - Get intervention updates
  - Receive photos/updates

#### API Endpoints
```
GET /api/childs/list/                    # Browse profiles
POST /api/childs/sponsor/{child_id}/     # Sponsor child
GET /api/childs/sponsorships/            # View sponsorships
GET /api/acadamicreport/results/         # View academic reports
```

---

### 2. Schools ✅
**Role**: SCHOOL

#### Functionality
- **Generate Academic Status Report** (UC-16)
  - Submit academic performance data
  - Upload report card images
  - Add teacher comments
  - Track attendance rates

- **Update Child Academic Status** (UC-17)
  - Update grades and scores
  - Update attendance records
  - Add progress notes
  - Upload supporting documents

- **Manage & Update Intervention Log** (UC-18)
  - Record interventions provided
  - Upload receipt images
  - Track intervention types (health, education, nutrition, clothing)
  - Update intervention status

- **View Enrolled Children**
  - List all enrolled children
  - View child profiles
  - Track academic progress
  - Monitor attendance

#### API Endpoints
```
POST /api/acadamicreport/results/        # Submit report
PUT /api/acadamicreport/results/{id}/    # Update report
GET /api/acadamicreport/results/my_reports/  # View submitted reports
POST /api/childs/interventions/          # Create intervention
PUT /api/childs/interventions/{id}/      # Update intervention
```

---

### 3. Orphanages ✅
**Role**: ORG_STAFF

#### Functionality
- **Submit Child Profile** (UC-03)
  - Register new child
  - Upload child photo
  - Upload supporting documents
  - Provide guardian information
  - Set vulnerability status

- **Track Submission Status** (UC-04)
  - View profile submission status
  - Track approval progress
  - Receive approval/rejection notifications
  - Update profile if rejected

- **Manage & Update Intervention Log** (UC-05)
  - Record interventions provided
  - Upload receipt images
  - Track intervention types
  - Update intervention records

- **Receive Sponsorship** (UC-06)
  - Get notified when child is sponsored
  - View sponsor information
  - Receive sponsorship details
  - Track sponsorship status

- **Monitor Implementation Program** (UC-07)
  - View program statistics
  - Track child progress
  - Monitor interventions
  - Generate reports

#### API Endpoints
```
POST /api/childs/register/               # Submit child profile
GET /api/childs/{id}/                    # View profile status
POST /api/childs/interventions/          # Create intervention
PUT /api/childs/interventions/{id}/      # Update intervention
GET /api/childs/interventions/           # View interventions
```

---

### 4. Religion Based Institutions ✅
**Role**: ORG_STAFF

#### Functionality
- **Submit Child Profile** (UC-03)
  - Register children in need
  - Upload documentation
  - Provide background information
  - Set vulnerability status

- **Track Submission Status** (UC-04)
  - Monitor profile approval
  - Receive status updates
  - Resubmit if rejected
  - Track changes

- **Manage & Update Intervention Log** (UC-05)
  - Record aid provided
  - Document interventions
  - Upload receipts
  - Track assistance

- **Receive Sponsorship** (UC-06)
  - Get sponsorship notifications
  - View sponsor details
  - Manage sponsorship relationship
  - Track support

- **Monitor Implementation Program** (UC-07)
  - View program metrics
  - Track child welfare
  - Monitor support delivery
  - Generate reports

#### API Endpoints
Same as Orphanages (ORG_STAFF role)

---

### 5. NGOs ✅
**Role**: ORG_STAFF

#### Functionality
- **Submit Child Profile** (UC-03)
  - Register vulnerable children
  - Upload photos and documents
  - Provide detailed background
  - Set vulnerability status

- **Track Submission Status** (UC-04)
  - Monitor approval process
  - Receive notifications
  - Update profiles
  - Track status changes

- **Manage & Update Intervention Log** (UC-05)
  - Record all interventions
  - Document aid provided
  - Upload supporting receipts
  - Track assistance types

- **Receive Sponsorship** (UC-06)
  - Get sponsorship notifications
  - Coordinate with sponsors
  - Manage relationships
  - Track commitments

- **Monitor Implementation Program** (UC-07)
  - View program statistics
  - Track child progress
  - Monitor interventions
  - Generate reports

#### API Endpoints
Same as Orphanages (ORG_STAFF role)

---

### 6. Project Manager ✅
**Role**: ADMIN

#### Functionality
- **Authorize Registration** (UC-09)
  - Review child profiles
  - Approve or reject profiles
  - Request additional information
  - Manage profile status

- **Approve/Reject Child Registration** (UC-10)
  - Make approval decisions
  - Publish approved profiles
  - Reject with feedback
  - Track decisions

- **Resolve Duplication Alert** (UC-11)
  - Identify duplicate profiles
  - Merge duplicate records
  - Prevent duplicate sponsorship
  - Maintain data integrity

- **Review Financial Document** (UC-19)
  - Review sponsorship documents
  - Verify commitment amounts
  - Approve financial records
  - Track financial data

- **Send Approval/Rejection Notification** (UC-20)
  - Notify organizations of decisions
  - Send rejection reasons
  - Provide feedback
  - Track notifications

- **Manage Users**
  - Create user accounts
  - Assign roles
  - Change user status
  - Reset passwords

#### API Endpoints
```
GET /api/childs/list/                    # View all profiles
PUT /api/childs/{id}/                    # Update profile status
DELETE /api/childs/{id}/                 # Delete profile
POST /api/accounts/manage/{id}/change-status/  # Change user status
GET /api/accounts/manage/                # List users
```

---

### 7. System Administrator ✅
**Role**: ADMIN

#### Functionality
- **Manage Users** (UC-21)
  - Create user accounts
  - Assign roles and permissions
  - Change user status (ACTIVE, SUSPENDED, REJECTED)
  - Reset passwords
  - Manage user access

- **Authorize Registration** (UC-09)
  - Review and approve profiles
  - Manage profile workflow
  - Handle rejections
  - Track approvals

- **Approve/Reject Child Registration** (UC-10)
  - Make final approval decisions
  - Publish profiles
  - Send notifications
  - Maintain records

- **Resolve Duplication Alert** (UC-11)
  - Detect duplicates
  - Merge records
  - Prevent fraud
  - Maintain data quality

- **Monitor Implementation Program** (UC-07)
  - View system statistics
  - Monitor all activities
  - Generate reports
  - Track performance

- **System Maintenance**
  - Manage database
  - Configure system settings
  - Monitor logs
  - Handle backups

#### API Endpoints
```
GET /api/accounts/manage/                # List all users
POST /api/accounts/manage/{id}/change-status/  # Change status
POST /api/accounts/manage/change-password/    # Reset password
GET /api/childs/list/                    # View all profiles
PUT /api/childs/{id}/                    # Update profile
DELETE /api/childs/{id}/                 # Delete profile
```

---

### 8. Government Body ✅
**Role**: GOVERNMENT

#### Functionality
- **Monitor Implementation Program** (UC-07)
  - View program statistics
  - Track child welfare
  - Monitor interventions
  - Generate reports

- **Receive Report** (UC-22)
  - Get program reports
  - View statistics
  - Track outcomes
  - Monitor compliance

- **View Child Progress**
  - Access child profiles
  - View academic reports
  - Track interventions
  - Monitor welfare

- **Generate Reports**
  - Create program reports
  - Export data
  - Analyze trends
  - Track metrics

#### API Endpoints
```
GET /api/childs/list/                    # View profiles
GET /api/acadamicreport/results/         # View reports
GET /api/childs/interventions/           # View interventions
```

---

### 9. Children ✅
**Role**: Implicit (data subject)

#### Functionality
- **Have Profile Created**
  - Profile registered by organizations
  - Information stored securely
  - Privacy protected

- **Be Sponsored**
  - Matched with sponsors
  - Receive support
  - Track progress

- **Receive Interventions**
  - Healthcare provided
  - Education support
  - Nutrition assistance
  - Clothing/shelter

- **Academic Tracking**
  - Grades recorded
  - Attendance tracked
  - Progress monitored
  - Reports generated

---

### 10. Automated Duplication Checker ✅
**Role**: System Process

#### Functionality
- **Automated Duplication Checker** (UC-02)
  - Scan new profiles
  - Compare with existing records
  - Identify potential duplicates
  - Alert administrators
  - Prevent duplicate sponsorship

#### Implementation
```python
# Triggered on child profile creation
# Checks:
- Similar names
- Same location
- Same age
- Same guardian
- Same vulnerability status
```

---

## Use Case Summary

| UC # | Use Case | Actor | Status |
|------|----------|-------|--------|
| UC-02 | Automated Duplication Checker | System | ✅ |
| UC-03 | Submit Child Profile | ORG_STAFF | ✅ |
| UC-04 | Track Submission Status | ORG_STAFF | ✅ |
| UC-05 | Manage & Update Intervention Log | ORG_STAFF, SCHOOL | ✅ |
| UC-06 | Receive Sponsorship | ORG_STAFF | ✅ |
| UC-07 | Monitor Implementation Program | ADMIN, GOVERNMENT | ✅ |
| UC-09 | Authorize Registration | ADMIN | ✅ |
| UC-10 | Approve/Reject Child Registration | ADMIN | ✅ |
| UC-11 | Resolve Duplication Alert | ADMIN | ✅ |
| UC-12 | Browse Approved Child Profiles | SPONSOR | ✅ |
| UC-13 | Sponsor a Child | SPONSOR | ✅ |
| UC-14 | Track Sponsorship History | SPONSOR | ✅ |
| UC-15 | View Child Academic Status | SPONSOR | ✅ |
| UC-16 | Generate Academic Status Report | SCHOOL | ✅ |
| UC-17 | Update Child Academic Status | SCHOOL | ✅ |
| UC-18 | Manage & Update Intervention Log | SCHOOL | ✅ |
| UC-19 | Review Financial Document | ADMIN | ✅ |
| UC-20 | Send Approval/Rejection Notification | ADMIN | ✅ |
| UC-21 | Manage Users | ADMIN | ✅ |
| UC-22 | Receive Report | GOVERNMENT | ✅ |

---

## Actor-to-Role Mapping

```
Individual Sponsor      → SPONSOR
Schools                 → SCHOOL
Orphanages             → ORG_STAFF
Religion Based Inst.   → ORG_STAFF
NGOs                   → ORG_STAFF
Project Manager        → ADMIN
System Administrator   → ADMIN
Government Body        → GOVERNMENT
Children               → (Data Subject)
Automated System       → (System Process)
```

---

## Permission Matrix

| Action | SPONSOR | ORG_STAFF | SCHOOL | ADMIN | GOVERNMENT |
|--------|---------|-----------|--------|-------|------------|
| Browse Profiles | ✅ | ✅ | ✅ | ✅ | ✅ |
| Register Child | ❌ | ✅ | ❌ | ✅ | ❌ |
| Sponsor Child | ✅ | ❌ | ❌ | ❌ | ❌ |
| Submit Report | ❌ | ❌ | ✅ | ✅ | ❌ |
| Create Intervention | ❌ | ✅ | ✅ | ✅ | ❌ |
| Approve Profile | ❌ | ❌ | ❌ | ✅ | ❌ |
| Manage Users | ❌ | ❌ | ❌ | ✅ | ❌ |
| View Reports | ✅ | ✅ | ✅ | ✅ | ✅ |
| Monitor Program | ❌ | ✅ | ❌ | ✅ | ✅ |

---

## API Access by Role

### SPONSOR
```
GET  /api/childs/list/
POST /api/childs/sponsor/{child_id}/
GET  /api/acadamicreport/results/
```

### ORG_STAFF
```
POST /api/childs/register/
GET  /api/childs/{id}/
POST /api/childs/interventions/
PUT  /api/childs/interventions/{id}/
GET  /api/childs/interventions/
```

### SCHOOL
```
POST /api/acadamicreport/results/
PUT  /api/acadamicreport/results/{id}/
GET  /api/acadamicreport/results/my_reports/
POST /api/childs/interventions/
PUT  /api/childs/interventions/{id}/
```

### ADMIN
```
GET  /api/accounts/manage/
POST /api/accounts/manage/{id}/change-status/
GET  /api/childs/list/
PUT  /api/childs/{id}/
DELETE /api/childs/{id}/
GET  /api/acadamicreport/results/
```

### GOVERNMENT
```
GET  /api/childs/list/
GET  /api/acadamicreport/results/
GET  /api/childs/interventions/
```

---

## Implementation Status

### Completed ✅
- All 5 user roles implemented
- All 20+ use cases covered
- All API endpoints created
- All permissions enforced
- All validations in place
- All error handling implemented
- All audit logging added

### Ready for Testing
- All endpoints functional
- All permissions working
- All validations active
- All logging operational

---

**Last Updated**: 2024
**Status**: ✅ COMPLETE
