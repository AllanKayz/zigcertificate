QUnit.module('Membership Category Validation', {
    beforeEach: function() {
        // Reset the input fields before each test
        document.getElementById('memberName').value = 'Test User';
        document.getElementById('membershipID').value = '12345';
        member = 'Test User';
        membershipNumber = 'ZIG12345';
        category = "REGISTERED AS A GEOMATICS PROFESSIONAL UNTIL 31 AUGUST " + (new Date().getFullYear() + 1);
    }
});

QUnit.test('should pass validation with lowercase category', function(assert) {
    const membershipCategoryInput = document.getElementById('membershipCategory');
    membershipCategoryInput.value = 'professional';

    // Trigger the change event to update the category
    const event = new Event('change');
    membershipCategoryInput.dispatchEvent(event);

    const result = validateFields();
    assert.ok(result, 'Validation should pass with lowercase category');
});

QUnit.test('should pass validation with mixed case category', function(assert) {
    const membershipCategoryInput = document.getElementById('membershipCategory');
    membershipCategoryInput.value = 'Professional';

    // Trigger the change event to update the category
    const event = new Event('change');
    membershipCategoryInput.dispatchEvent(event);

    const result = validateFields();
    assert.ok(result, 'Validation should pass with mixed case category');
});

QUnit.test('should fail validation with invalid category', function(assert) {
    const membershipCategoryInput = document.getElementById('membershipCategory');
    membershipCategoryInput.value = 'invalid';

    // Trigger the change event to update the category
    const event = new Event('change');
    membershipCategoryInput.dispatchEvent(event);

    const result = validateFields();
    assert.notOk(result, 'Validation should fail with an invalid category');
});