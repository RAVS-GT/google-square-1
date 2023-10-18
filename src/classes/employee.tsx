export class Employee {
    employeeId: string;
    status: string;
    givenName: string;
    familyName: string;
    email: string;
    phoneNumber: string;
    referenceId?: string;
    isOwner?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
    assignedLocations?: {
        assignmentType: string;
        locationIds: string[];
    };

    constructor(data: any) {
        this.employeeId = data.id;
        this.status = data.status;
        this.givenName = data.given_name;
        this.familyName = data.family_name;
        this.email = data.email_address;
        this.phoneNumber = data.phone_number;

        // The following properties are optional and will be set only if they exist in the data
        if (data.reference_id) {
            this.referenceId = data.reference_id;
        }
        if (data.is_owner !== undefined) {
            this.isOwner = data.is_owner;
        }
        if (data.created_at) {
            this.createdAt = new Date(data.created_at);
        }
        if (data.updated_at) {
            this.updatedAt = new Date(data.updated_at);
        }
        if (data.assigned_locations) {
            this.assignedLocations = {
                assignmentType: data.assigned_locations.assignment_type,
                locationIds: data.assigned_locations.location_ids
            };
        }
    }

    // Getter for full name
    get fullName(): string {
        return `${this.givenName} ${this.familyName}`;
    }
}

// Example usage:
const employeesData = [
    {
        "team_member": {
            "id": "1yJlHapkseYnNPETIU1B",
            "reference_id": "reference_id_1",
            "is_owner": false,
            "status": "ACTIVE",
            "given_name": "Joe",
            "family_name": "Doe",
            "email_address": "joe_doe@example.com",
            "phone_number": "+14159283333",
            "created_at": "2021-06-11T22:55:45Z",
            "updated_at": "2021-06-15T17:38:05Z",
            "assigned_locations": {
                "assignment_type": "EXPLICIT_LOCATIONS",
                "location_ids": [
                    "GA2Y9HSJ8KRYT",
                    "YSGH2WBKG94QZ"
                ]
            }
        }
    },
    {
        "team_member": {
            "id": "5tRlGjpoXeYgMNERTT2C",
            "reference_id": "reference_id_2",
            "is_owner": true,
            "status": "ACTIVE",
            "given_name": "Jane",
            "family_name": "Smith",
            "email_address": "jane_smith@example.com",
            "phone_number": "+14159283334",
            "created_at": "2020-05-10T19:45:40Z",
            "updated_at": "2021-05-12T13:28:02Z",
            "assigned_locations": {
                "assignment_type": "EXPLICIT_LOCATIONS",
                "location_ids": [
                    "HJ8Y2GSJ2LRYT",
                    "YSJH1WBKQ84QZ"
                ]
            }
        }
    },
    {
        "team_member": {
            "id": "8zJkGtpmReVbPLKERT3D",
            "reference_id": "reference_id_3",
            "is_owner": false,
            "status": "INACTIVE",
            "given_name": "Bob",
            "family_name": "Brown",
            "email_address": "bob_brown@example.com",
            "phone_number": "+14159283335",
            "created_at": "2019-03-20T10:15:30Z",
            "updated_at": "2020-04-14T09:08:01Z",
            "assigned_locations": {
                "assignment_type": "EXPLICIT_LOCATIONS",
                "location_ids": [
                    "GJ9Z0YSJ3MUYT",
                    "HSJH2ZBKD94QZ"
                ]
            }
        }
    }
];

export const employees=employeesData.map((employeeData) => new Employee(employeeData));