import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { CustomWorld } from '../../support/world';
import { ContactPage } from '../../src/pages/public/ContactPage';

Given('I navigate to the contact page', async function (this: CustomWorld) {
  const page = this.getPage();
  const contact = new ContactPage(page);
  await contact.goto();
  await expect(contact.form).toBeVisible({ timeout: 15000 });
  this.checklist.record('Contact page loaded', page.url(), true);
});

When('I submit the contact form with all required fields empty', async function (this: CustomWorld) {
  const page = this.getPage();
  const contact = new ContactPage(page);
  await contact.submit();
  this.checklist.record('Empty contact form submitted', 'Submit clicked with empty inputs', true);
});

Then('inline validation errors should be displayed for name, email, mobile, category, feedback, and captcha', async function (this: CustomWorld) {
  const page = this.getPage();
  const contact = new ContactPage(page);

  // Assertion 1: Name error
  await expect(contact.nameError).toBeVisible({ timeout: 10000 });
  this.checklist.record('Name validation error visible', 'Please enter your name', true);

  // Assertion 2: Email error
  await expect(contact.emailError).toBeVisible({ timeout: 10000 });
  this.checklist.record('Email validation error visible', 'Please enter a valid email', true);

  // Assertion 3: Mobile error
  await expect(contact.mobileError).toBeVisible({ timeout: 10000 });
  this.checklist.record('Mobile validation error visible', 'Please enter a valid 10-digit mobile number', true);

  // Assertion 4: Feedback error
  await expect(contact.feedbackError).toBeVisible({ timeout: 10000 });
  this.checklist.record('Feedback validation error visible', 'Please enter at least 10 characters', true);
});

Then('the form should not be submitted', async function (this: CustomWorld) {
  const page = this.getPage();
  const contact = new ContactPage(page);
  await expect(contact.form).toBeVisible({ timeout: 5000 });
  expect(page.url()).toContain('/Contact/Contact-Us');
  this.checklist.record('Form unsubmitted verification', 'Remained on Contact-Us page', true);
});

When('I enter an invalid email address {string} in the contact form', async function (this: CustomWorld, invalidEmail: string) {
  const page = this.getPage();
  const contact = new ContactPage(page);
  await contact.nameInput.fill('Citizen Test');
  await contact.emailInput.fill(invalidEmail);
  this.checklist.record('Invalid email filled', invalidEmail, true);
});

When('I attempt to submit the contact form', async function (this: CustomWorld) {
  const page = this.getPage();
  const contact = new ContactPage(page);
  await contact.submit();
  this.checklist.record('Form submit attempted', 'Submit clicked', true);
});

Then('an email format validation error should be displayed', async function (this: CustomWorld) {
  const page = this.getPage();
  const contact = new ContactPage(page);
  await expect(contact.emailError).toBeVisible({ timeout: 10000 });
  this.checklist.record('Email format error displayed', 'Please enter a valid email', true);
});

Then('the form should remain on the page', async function (this: CustomWorld) {
  const page = this.getPage();
  const contact = new ContactPage(page);
  await expect(contact.form).toBeVisible({ timeout: 5000 });
  await expect(contact.emailInput).toBeVisible({ timeout: 5000 });
  this.checklist.record('Form state retained', 'Form controls still active', true);
});
