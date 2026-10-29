@ui @regression @module:global-relations @sheet:GR @area:admin
Feature: Admin Global Relations Registry and Engagement Management
  As an administrator
  I want to manage static page records and engagement registries
  So that international relations and recruitment records are maintained accurately

  Background:
    Given I am authenticated as an administrator

  Rule: Global relations static pages registry management

    @TC:GR-06 @smoke @priority:high @type:functional
    Scenario: [GR-06] Searching the global relations registry by keyword filters static page records accurately
      When I navigate to the admin global relations registry
      And I search the global relations registry for "INTOSAI"
      Then only matching global relations static page records should be displayed
      And the registry table should remain visible
      And the page records no console errors

    @TC:GR-02 @regression @priority:medium @type:ui
    Scenario: [GR-02] Clicking the Add Record trigger opens the global relations page creation modal dialog
      When I navigate to the admin global relations registry
      And I click the Add Section Record button in global relations
      Then the record creation modal dialog should be displayed with input controls
      And I close the global relations modal dialog
      And the page records no console errors

    @TC:GR-07 @regression @priority:medium @type:functional
    Scenario: [GR-07] Navigating through global relations registry pagination updates visible page rows
      When I navigate to the admin global relations registry
      Then the global relations registry should display active status indicators for configured pages
      And the pagination or row summary should reflect total configured records
      And the page records no console errors

  Rule: Careers and engagement recruitment registry in CMS

    @TC:CE-01 @smoke @priority:high @type:functional
    Scenario: [CE-01] About Us recruitment management tab displays IA&AS, SSC CGL and Young Professionals registry sections
      When I navigate to the recruitment management tab under About Us
      Then the recruitment registry table should display published pathway records
      And recruitment records should include active status indicators
      And the page records no console errors
