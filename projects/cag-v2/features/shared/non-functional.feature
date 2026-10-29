@non-functional @regression @module:non-functional @sheet:NF @area:shared
Feature: System Non-Functional Attributes — Security Controls and Accessibility Standards
  As a quality compliance auditor
  I want to verify non-functional security guards and accessibility compliance
  So that administrative endpoints are protected and public portals meet WCAG 2.1 AA guidelines

  Rule: Administrative API token guard security

    @TC:NF-01 @smoke @priority:high @type:security
    Scenario: [NF-01] Sampled administrative API endpoints reject unauthenticated requests with HTTP 401 or 403
      When I probe multiple protected administrative endpoints without authorization
      Then all sampled administrative endpoints should return 401 or 403 status codes

  Rule: Digital accessibility (WCAG 2.1 AA) and semantic structure

    @TC:NF-11 @regression @priority:medium @type:a11y
    Scenario: [NF-11] Key portal pages maintain compliant visual readability and color contrast standards
      When I navigate to the public home portal page
      Then page text content should render with legible visual presentation and background separation
      And the page records no console errors

    @TC:NF-12 @smoke @priority:high @type:a11y
    Scenario: [NF-12] Informative image assets across public pages declare meaningful alt attributes
      When I inspect the images on the public home portal page
      Then all informative images should provide descriptive alt text
      And the page records no console errors

    @TC:NF-13 @regression @priority:high @type:a11y
    Scenario: [NF-13] Core page architecture contains semantic HTML5 landmarks for screen-reader navigation
      When I inspect the DOM architecture of the home portal
      Then semantic landmarks header, nav, main, and footer should be properly declared
      And the page records no console errors
