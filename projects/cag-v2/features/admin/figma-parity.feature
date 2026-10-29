@ui @regression @module:figma-parity @sheet:FP @area:admin
Feature: Administrative Interface Figma Design Parity and Layout Standards
  As a portal quality engineer
  I want to verify admin portal screens against canonical Figma design tokens
  So that navigation hierarchy, branding, status badging, and bilingual tags are uniform

  Background:
    Given I am authenticated as an administrator

  Rule: Global admin navigation sidebar and top header consistency

    @TC:FP-17 @smoke @priority:high @type:ui
    Scenario: [FP-17] Sidebar navigation retains consistent hierarchy and module grouping across administrative screens
      When I open the admin portal navigation sidebar
      Then the sidebar should contain navigation links for Home, Reports, Our Presence, Global Relations, and About Us
      And the active module item should be highlighted
      And the page records no console errors

    @TC:FP-18 @regression @priority:medium @type:ui
    Scenario: [FP-18] Top administration bar maintains uniform language selector and authenticated user identity avatar
      Then the admin top bar should display the language selector and user profile menu
      And the portal brand emblem should be present in the header
      And the page records no console errors

  Rule: Administrative table design tokens and status representation

    @TC:FP-19 @regression @priority:medium @type:ui
    Scenario: [FP-19] Module registry tables display standardized status badge styling with green active indicators
      When I navigate to the admin banners management screen
      Then table status badges should display green active styling for published records
      And the page records no console errors

    @TC:FP-20 @regression @priority:medium @type:ui
    Scenario: [FP-20] Module registry tables provide clear bilingual language designation badges
      When I navigate to the admin banners management screen
      Then table rows should clearly indicate the designated content language
      And the table layout should maintain horizontal alignment without broken cells
      And the page records no console errors
