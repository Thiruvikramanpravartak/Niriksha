@ui @regression @module:admin-dashboard @sheet:AD @area:admin
Feature: Administrator Portal Dashboard and Session Route Guards
  As an administrator system
  I want to restrict access to protected admin portal dashboards
  So that unauthenticated users cannot view sensitive portal data

  Rule: Unauthenticated direct route access protection

    @TC:AD-13 @smoke @priority:high @type:security
    Scenario: [AD-13] Attempting to access protected admin dashboard URL directly without an active session redirects to login
      When I attempt to access the admin dashboard URL directly without a session
      Then I should be redirected to the admin login page
      And the protected dashboard metrics or banners should not be rendered
      And the page records no console errors
