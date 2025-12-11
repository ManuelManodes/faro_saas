export const initialData = {
    users: [
        { id: 1, name: "Alice Johnson", email: "alice@example.com", role: "Admin", status: "Active" },
        { id: 2, name: "Bob Smith", email: "bob@example.com", role: "User", "status": "Inactive" },
        { id: 3, name: "Charlie Brown", email: "charlie@example.com", "role": "Editor", "status": "Active" },
        { id: 4, name: "Diana Prince", "email": "diana@example.com", "role": "User", "status": "Active" },
        { id: 5, "name": "Evan Wright", "email": "evan@example.com", "role": "User", "status": "Inactive" }
    ],
    stats: [
        {
            title: "Total Users",
            value: "12,345",
            change: "+12%",
            icon: "Users"
        },
        {
            title: "Active Sessions",
            value: "573",
            "change": "+5%",
            icon: "Activity"
        },
        {
            title: "Revenue",
            value: "$45,231",
            "change": "+23%",
            icon: "DollarSign"
        },
        {
            title: "Growth",
            value: "18.2%",
            "change": "+4%",
            "icon": "TrendingUp"
        }
    ]
};
