        const { validateBugData } = require('../../utils/helpers');

        describe('Bug Validation', () => {
        test('should validate a valid bug', () => {
            const validBug = {
            title: 'Test Bug',
            description: 'This is a test bug',
            status: 'open',
            severity: 'medium'
            };
            
            const result = validateBugData(validBug);
            expect(result.isValid).toBe(true);
            expect(result.errors).toEqual({});
        });
        
        test('should invalidate a bug with missing title', () => {
            const invalidBug = {
            description: 'This is a test bug',
            status: 'open',
            severity: 'medium'
            };
            
            const result = validateBugData(invalidBug);
            expect(result.isValid).toBe(false);
            expect(result.errors).toHaveProperty('title');
        });
        
        test('should invalidate a bug with invalid status', () => {
            const invalidBug = {
            title: 'Test Bug',
            description: 'This is a test bug',
            status: 'invalid-status',
            severity: 'medium'
            };
            
            const result = validateBugData(invalidBug);
            expect(result.isValid).toBe(false);
            expect(result.errors).toHaveProperty('status');
        });
        });