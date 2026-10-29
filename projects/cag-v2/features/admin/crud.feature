@ui @regression @module:crud @sheet:AC @area:admin
Feature: Admin Record Creation, CRUD Lifecycle and Cross-Layer Consistency
  As an administrator
  I want to manage CMS content records across modules
  So that updates appear in the admin UI, are verified via API, and persist in the database

  Background:
    Given I am logged in as an administrator

  Rule: Record lifecycle, CRUD operations and cross-layer verification

    @TC:AC-01 @TC:AC-08 @smoke @priority:high @type:functional
    Scenario: [AC-01, AC-08] Creating a new content record displays the record immediately in the table and public portal API
      When I create a new content record in the module
      Then the record should appear in the admin table
      And the record should be retrievable via the backend API
      And the page records no console errors

    @TC:AC-02 @smoke @priority:high @type:functional
    Scenario: [AC-02] Editing an existing administrative content record saves modifications and updates table row columns accurately
      When I edit an existing record in the table
      Then the updated record details should be displayed in the table
      And no network request on the page returns a 4xx or 5xx status
      And the page records no console errors

    @TC:AC-03 @regression @priority:high @type:functional
    Scenario: [AC-03] Confirming record deletion removes the targeted entry permanently from the administrative management table
      When I delete a record from the table
      Then the record should no longer be present in the table
      And no network request on the page returns a 4xx or 5xx status
      And the page records no console errors

    @TC:AC-14 @smoke @priority:high @type:data-integrity
    Scenario: [AC-14] Three-level verification confirms newly created record presence across user interface, backend API, and database
      When I create a verified record in the admin module
      Then the record should exist in the UI table
      And the record should exist in the API response
      And the record row should be verifiable in the database
      And the page records no console errors

    @TC:AC-15 @regression @priority:medium @type:functional
    Scenario: [AC-15] Executing administrative record mutations creates a corresponding audit log entry capturing actor and action details
      When an administrative action is executed
      Then a corresponding audit log entry should be recorded
      And no network request on the page returns a 4xx or 5xx status
      And the page records no console errors

  Rule: Administrative table filtering, search, sorting and pagination

    @TC:AC-04 @regression @priority:high @type:functional
    Scenario: [AC-04] Searching the administrative management table by keyword filters matching content rows without unhandled exceptions
      When I search the admin table for "Audit"
      Then only records matching "Audit" should remain in the table
      And no network request on the page returns a 4xx or 5xx status
      And the page records no console errors

    @TC:AC-05 @regression @priority:high @type:functional
    Scenario: [AC-05] Filtering administrative records by status dropdown isolates active and draft rows according to publication state
      When I filter the admin table by status "Published"
      Then all displayed records in the table should have status "Published"
      And no network request on the page returns a 4xx or 5xx status
      And the page records no console errors

    @TC:AC-06 @regression @priority:medium @type:functional
    Scenario: [AC-06] Navigating administrative table pagination controls displays subsequent record pages without duplicate rows or skipping
      When I navigate to the next page in the admin table
      Then the table should render the next set of records
      And no network request on the page returns a 4xx or 5xx status
      And the page records no console errors

    @TC:AC-07 @regression @priority:medium @type:functional
    Scenario: [AC-07] Adjusting the administrative table rows-per-page selector expands record density while keeping pagination counters synchronized
      When I set the admin rows per page to 25
      Then the admin table should adjust its display to 25 rows
      And no network request on the page returns a 4xx or 5xx status
      And the page records no console errors

    @TC:AC-13 @regression @priority:medium @type:ui
    Scenario: [AC-13] Sorting the administrative table by title column reorders table rows into ascending lexicographical order
      When I sort the admin table by title column
      Then records should be reordered accordingly
      And no network request on the page returns a 4xx or 5xx status
      And the page records no console errors

  Rule: Form validation, bilingual content and attachment security

    @TC:AC-09 @regression @priority:high @type:functional
    Scenario: [AC-09] Submitting an incomplete record creation form triggers field validation warnings and prevents empty database writes
      When I attempt to submit an empty create form
      Then required field validation warnings should be displayed
      And the page returns no 5xx response
      And the page records no console errors

    @TC:AC-10 @regression @priority:medium @type:security
    Scenario: [AC-10] Uploading disallowed executable file types is rejected with clear error notices and stores zero files
      When I upload a file with an invalid extension ".exe"
      Then a file extension error message should be displayed
      And the page returns no 5xx response
      And the page records no console errors

    @TC:AC-11 @regression @priority:medium @type:security
    Scenario: [AC-11] Uploading oversized attachments exceeding permissible size thresholds fails validation and blocks database storage
      When I upload an oversized file exceeding 50MB
      Then an attachment file size limit error should be displayed
      And the page returns no 5xx response
      And the page records no console errors

    @TC:AC-12 @regression @priority:medium @type:localization
    Scenario: [AC-12] Submitting content records with bilingual English and Hindi titles persists both language variants accurately
      When I create a record with both English and Hindi titles
      Then both language titles should be saved and verifiable
      And no network request on the page returns a 4xx or 5xx status
      And the page records no console errors
