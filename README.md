# Pine Lead Webform

A React + Vite webform for SureStrat insurance quoting.

## Features

- Multi-step insurance quote form (policyholder, vehicle, personal, review)
- Form validation with [zod](https://github.com/colinhacks/zod)
- Modern UI with Tailwind CSS and [lucide-react](https://lucide.dev/)
- API integration using [axios](https://axios-http.com/)
- Shows raw API response for debugging and integration
- Modular, component-based architecture

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- npm

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

### Build

```bash
npm run build
```

### Lint

```bash
npm run lint
```

## API Integration

- The form submits a payload to the SureStrat API using axios.
- The payload structure is built in `src/pages/QuoteForm.jsx` in the `onSubmit` handler.
- The axios instance and API helper are in `src/utils/api.js`.
- The API response is shown in the review step for easy debugging and mapping.

## Validation Errors Explained

When you see a "Validation Errors" object like this in the review step, it means the form data did not pass the validation rules defined in your schema (using [zod](https://github.com/colinhacks/zod)).  
Each field listed has a problem that must be fixed before the form can be submitted successfully.

**Example:**

```json
{
	"ownerVehicleDetails": {
		"ownersFirstName": {
			"message": "Owner's Name is required",
			"type": "too_small"
		},
		"ownersLastName1": {
			"message": "Owner's Surname is required",
			"type": "too_small"
		},
		"ownersContactNumber1": {
			"message": "Invalid phone number",
			"type": "invalid_string"
		},
		"ownersIdNumber": {
			"message": "ID number must be 13 digits",
			"type": "invalid_string"
		},
		"relationshipToOwner": {
			"message": "Required",
			"type": "invalid_type"
		}
	},
	"regulardriverDetails": {
		"regularDriverFirstName": {
			"message": "Name is required",
			"type": "too_small"
		},
		"regularDriverLastName": {
			"message": "Surname is required",
			"type": "too_small"
		},
		"regularDriverContactNumber": {
			"message": "Invalid phone number",
			"type": "invalid_string"
		},
		"regularDriverIdNumber": {
			"message": "ID number must be 13 digits",
			"type": "invalid_string"
		},
		"relationToRegularDriver": {
			"message": "Required",
			"type": "invalid_type"
		}
	}
}
```

**What this means:**

- Each property (e.g. `ownersFirstName`, `regularDriverContactNumber`) failed a validation rule.
- The `message` tells you what is wrong (e.g. "Owner's Name is required", "Invalid phone number").
- The `type` gives the kind of validation error (e.g. `too_small` for required/min length, `invalid_string` for pattern/format).
- Fix these fields in the form (e.g. fill in the missing names, enter a valid phone number or ID number) to proceed.

## Why do I see "Validation Errors" even after completing the form?

If you see a "Validation Errors" object like this in the review step, it means **the form still contains missing or invalid data for some required fields**.  
This can happen if:

- You skipped a section or left required fields blank (for example, owner or regular driver details).
- Some fields are only required if you answered "No" to "Are you the owner?" or "Are you the regular driver?".
- The form UI allowed you to proceed, but the final validation (using zod) still found missing/invalid values.

**What to do:**

- Check the error messages in the object. For example:
  - `"Owner's Name is required"` means you must fill in the owner's first name.
  - `"Invalid phone number"` means the phone number format is wrong.
  - `"ID number must be 13 digits"` means you need a valid South African ID number.
- Go back to the relevant step and fill in the missing or invalid fields.
- Only when all required fields are valid will the form submit successfully.

**Note:**  
Some fields are conditionally required. For example, if you are **not** the owner, you must fill in all owner details. If you are **not** the regular driver, you must fill in all regular driver details.

## File Structure

- `src/pages/QuoteForm.jsx` - Main form logic and stepper
- `src/components/form/` - Form sections and UI components
- `src/utils/api.js` - API integration (axios)
- `src/schemas/quoteFormSchema.js` - Form validation schemas

## Customization

- Update the API base URL and endpoint in `src/utils/api.js`.
- Adjust the payload mapping in `QuoteForm.jsx` as needed for your backend.

## License

MIT
