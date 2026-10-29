@module:admin-audit-log @sheet:AL @area:admin
Feature: Administrative Audit Log — comprehensive action traceability, data state diffs and event filtering
  As a compliance officer or system administrator monitoring CMS security
  I want an immutable audit log tracking administrative creations, updates, and deletions with before and after state diffs
  So that regulatory accountability and administrative change tracking are strictly enforced

  Background:
    Given I navigate to the admin audit log viewer

  Rule: Administrative change event capture and state diff verification

    @TC:AL-01 @regression @priority:high @type:audit
    Scenario: [AL-01] Executing a record creation logs an audit entry capturing actor identity, target entity, and initial payload
      Then the audit log captures the CREATE action with entity details and new payload
      And the database audit records confirm persistence across all transactions
      And the page records no console errors

    @TC:AL-02 @regression @priority:high @type:audit
    Scenario: [AL-02] Modifying an existing record logs an audit entry capturing previous values alongside updated field attributes
      Then the audit log captures the UPDATE action with prior state and updated fields
      And the database audit records confirm persistence across all transactions
      And the page records no console errors

    @TC:AL-03 @regression @priority:high @type:audit
    Scenario: [AL-03] Deleting an existing record logs an audit entry preserving the prior record state for forensic verification
      Then the audit log captures the DELETE action preserving the prior record state
      And the database audit records confirm persistence across all transactions
      And the page records no console errors

  Rule: Audit log search, action filtering and record sorting

    @TC:AL-06 @regression @priority:medium @type:functional
    Scenario: [AL-06] Filtering the audit log viewer by administrative action type returns exclusively matching operational log records
      When I filter the audit log viewer by action "CREATE"
      Then the audit log table displays only entries matching action "CREATE"
      And no network request on the page returns a 4xx or 5xx status
      And the page records no console errors
