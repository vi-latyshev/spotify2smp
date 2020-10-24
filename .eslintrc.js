module.exports = {
    root: true,
    parser: '@typescript-eslint/parser',
    plugins: [
        '@typescript-eslint',
    ],
    extends: [
        'airbnb-typescript/base',
        'plugin:import/typescript'
    ],
    env: {
        'node': true
    },
    parserOptions: {
        'project': './tsconfig.json',
    },
    rules: {
        'max-len': ['error', {
            'ignoreStrings': true,
            'ignoreTemplateLiterals': true,
            'code': 120
        }],
        '@typescript-eslint/indent': ['error', 4],
        '@typescript-eslint/semi': ['error'],
        '@typescript-eslint/no-duplicate-imports': 'off',
        '@typescript-eslint/import-name': 'off',
        '@typescript-eslint/type-annotation-spacing': 'error',
        'import/prefer-default-export': 'off',
        'import/no-default-export': 'off',
        'no-mixed-operators': 'off',
        'no-shadow': 'off',
        'import/order': 'off',
        'consistent-return': 'off',
        'no-param-reassign': ['error', { 'props': false }],
        '@typescript-eslint/no-explicit-any': 'off',
        'import/no-webpack-loader-syntax': 'off',
        'no-restricted-syntax': 'off',
        'space-infix-ops': ['error', { 'int32Hint': true }],
        '@typescript-eslint/member-ordering': ['warn', {
            'default': [
                'static-field', // = ['public-static-field', 'protected-static-field', 'private-static-field']
                'instance-field', // = ['public-instance-field', 'protected-instance-field', 'private-instance-field']
                'abstract-field', // = ['public-abstract-field', 'protected-abstract-field', 'private-abstract-field']

                'constructor', // = ['public-constructor', 'protected-constructor', 'private-constructor']

                'static-method', // = ['public-static-method', 'protected-static-method', 'private-static-method']
                'instance-method', // = ['public-instance-method', 'protected-instance-method', 'private-instance-method']
                'abstract-method' // = ['public-abstract-method', 'protected-abstract-method', 'private-abstract-method']
            ]
        }],
    },
};