@ui @regression @module:contact @sheet:CT @area:public
Feature: Public Citizen Contact & Grievance Portal
  As a citizen
  I want to submit inquiries and feedback via the CAG Contact Portal
  So that my issues are validated, protected with captcha, and routed correctly

  Background:
    Given I navigate to the contact page

  Rule: Contact form field validation and error handling

    @TC:CT-10 @smoke @priority:high @type:functional
    Scenario: [CT-10] Submitting the contact form with missing required fields triggers inline field validation errors
      When I submit the contact form with all required fields empty
      Then inline validation errors should be displayed for name, email, mobile, category, feedback, and captcha
      And the form should not be submitted
      And the page records no console errors

    @TC:CT-10 @regression @priority:medium @type:functional
    Scenario: [CT-10] Submitting an invalid email address triggers a specific format validation error
      When I enter an invalid email address "not-an-email" in the contact form
      And I attempt to submit the contact form
      Then an email format validation error should be displayed
      And the form should remain on the page
      And the page records no console errors
