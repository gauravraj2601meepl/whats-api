/*
{
    "version": "6.3",
    "screens": [
        {
            "id": "bank_account",
            "title": "Add Bank Details",
            "data": {},
            "terminal": true,
            "success": true,
            "layout": {
                "type": "SingleColumnLayout",
                "children": [
                    {
                        "type": "Form",
                        "name": "form",
                        "children": [
                            {
                                "type": "TextInput",
                                "name": "account_number",
                                "label": "Account Number",
                                "input-type": "text",
                                "required": true
                            },
                            {
                                "type": "TextInput",
                                "label": "Account Holder Name",
                                "name": "account_holder",
                                "input-type": "text",
                                "required": true
                            },
                            {
                                "type": "TextInput",
                                "label": "Bank Name",
                                "required": true,
                                "name": "bank_name"
                            },
                            {
                                "type": "TextInput",
                                "label": "Bank Branch",
                                "required": true,
                                "name": "bank_branch"
                            },
                            {
                                "type": "TextInput",
                                "label": "IFSC Code",
                                "required": false,
                                "name": "ifsc_code"
                            },
                            {
                                "type": "RadioButtonsGroup",
                                "label": "Account Type",
                                "name": "account_type",
                                "data-source": [
                                    {
                                        "id": "0_saving",
                                        "title": "Saving"
                                    },
                                    {
                                        "id": "1_current",
                                        "title": "Current"
                                    }
                                ],
                                "required": true
                            },
                            {
                                "type": "Footer",
                                "label": "Submit",
                                "on-click-action": {
                                    "name": "complete",
                                    "payload": {
                                        "account_number": "${form.account_number}",
                                        "account_holder": "${form.account_holder}",
                                        "bank_name": "${form.bank_name}",
                                        "bank_branch": "${form.bank_branch}",
                                        "ifsc_code": "${form.ifsc_code}",
                                        "account_type": "${form.account_type}"
                                    }
                                }
                            }
                        ]
                    }
                ]
            }
        }
    ]
}

/////////////////////

{
    "version": "6.3",
    "screens": [
        {
            "id": "employee_identity_proof",
            "title": "Add Identity Proof",
            "data": {},
            "layout": {
                "type": "SingleColumnLayout",
                "children": [
                    {
                        "type": "Form",
                        "name": "form",
                        "children": [
                            {
                                "type": "RadioButtonsGroup",
                                "label": "Proof Type",
                                "name": "proof_type",
                                "data-source": [
                                    {
                                        "id": "0_aadhar",
                                        "title": "AADHAR"
                                    },
                                    {
                                        "id": "1_pan",
                                        "title": "PAN"
                                    },
                                    {
                                        "id": "1_passport",
                                        "title": "PASSPORT"
                                    }
                                ],
                                "required": true
                            },
                            {
                                "type": "TextInput",
                                "label": "Name",
                                "name": "proof_name",
                                "input-type": "text",
                                "required": true
                            },
                            {
                                "type": "TextInput",
                                "label": "Number",
                                "required": true,
                                "name": "proof_number"
                            },
                            {
                                "type": "Footer",
                                "label": "Next",
                                "on-click-action": {
                                    "name": "navigate",
                                    "next": {
                                        "type": "screen",
                                        "name": "employee_address"
                                    },
                                    "payload": {
                                        "proof_number": "${form.proof_number}",
                                        "proof_type": "${form.proof_type}",
                                        "proof_name": "${form.proof_name}"
                                    }
                                }
                            }
                        ]
                    }
                ]
            }
        },
        {
            "id": "employee_address",
            "title": "Add Address",
            "data": {
                "proof_number": {
                    "type": "string",
                    "__example__": "Example Number"
                },
                "proof_type": {
                    "type": "string",
                    "__example__": "Example Type"
                },
                "proof_name": {
                    "type": "string",
                    "__example__": "Example Name"
                }
            },
            "terminal": true,
            "success": true,
            "layout": {
                "type": "SingleColumnLayout",
                "children": [
                    {
                        "type": "Form",
                        "name": "form",
                        "children": [
                            {
                                "type": "TextInput",
                                "label": "Street",
                                "name": "street",
                                "input-type": "text",
                                "required": true
                            },
                            {
                                "type": "TextInput",
                                "label": "City",
                                "name": "city",
                                "input-type": "text",
                                "required": true
                            },
                            {
                                "type": "TextInput",
                                "label": "State",
                                "name": "state",
                                "input-type": "text",
                                "required": true
                            },
                            {
                                "type": "TextInput",
                                "label": "Country",
                                "name": "country",
                                "input-type": "text",
                                "required": true
                            },
                            {
                                "type": "Footer",
                                "label": "Submit",
                                "on-click-action": {
                                    "name": "complete",
                                    "payload": {
                                        "street": "${form.street}",
                                        "city": "${form.city}",
                                        "state": "${form.state}",
                                        "country": "${form.country}",
                                        "proof_number": "${data.proof_number}",
                                        "proof_type": "${data.proof_type}",
                                        "proof_name": "${data.proof_name}"
                                    }
                                }
                            }
                        ]
                    }
                ]
            }
        }
    ]
}




*/