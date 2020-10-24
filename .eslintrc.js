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
        "no-unused-vars": "off",
        "@typescript-eslint/no-unused-vars": ["warn"],
        '@typescript-eslint/no-explicit-any': 'off',
        'import/no-webpack-loader-syntax': 'off',
        'no-restricted-syntax': 'off',
        'space-infix-ops': ['error', { 'int32Hint': true }],
        'radix': ['error', 'as-needed'],
        '@typescript-eslint/member-ordering': ['warn', {
            'default': [
                'public-static-field',
                'protected-static-field',
                'private-static-field',

                'public-static-method',
                'protected-static-method',
                'private-static-method',

                'public-field',
                'protected-field',
                'private-field',

                'constructor',

                'public-method',
                'protected-method',
                'private-method'
            ]
        }],
    },
};