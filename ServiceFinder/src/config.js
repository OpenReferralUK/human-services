const initial_data = {
    "general": {
        "dataExpirationTime": '3h',
        "dataRefreshTime": "2",
        "allowFavouritesSearches": true,
        "allowFavouriteServices": true
    },
    "persona_profile": {
        "proximity": [{
                "value": 1,
                "label": "1 Mile"
            },
            {
                "value": 2,
                "label": "2 Miles"
            },
            {
                "value": 3,
                "label": "3 Miles"
            },
            {
                "value": 4,
                "label": "Other distance..."
            }
        ],
        "gender": [{
                "value": 0,
                "label": "Male only"
            },
            {
                "value": 1,
                "label": "Female only"
            },
            {
                "value": 2,
                "label": "Any"
            }
        ],
        "days": {
            "day": [{
                    "id": "0",
                    "value": "MO",
                    "label": "Monday"
                },
                {
                    "id": "1",
                    "value": "TU",
                    "label": "Tuesday"
                },
                {
                    "id": "2",
                    "value": "WE",
                    "label": "Wednesday"
                },
                {
                    "id": "3",
                    "value": "TH",
                    "label": "Thursday"
                },
                {
                    "id": "4",
                    "value": "FR",
                    "label": "Friday"
                },
                {
                    "id": "5",
                    "value": "SA",
                    "label": "Saturday"
                },
                {
                    "id": "6",
                    "value": "SU",
                    "label": "Sunday"
                }
            ],
            "time": [{
                    "value": "0",
                    "label": "Morning"
                },
                {
                    "value": "1",
                    "label": "Afternoon"
                },
                {
                    "value": "2",
                    "label": "Evening"
                },
                {
                    "value": "3",
                    "label": "All Day"
                },
            ]
        },
        "persona": [{
                "value": 0,
                "label": "Lonely",
                "data": {
                    "needs": ["122", "71", "111", "115", "67", "36", "66", "68"],
                    "circumstances": ["1", "191", "185", "165", "205", "210", "213", "218", "220"]
                }
            },
            {
                "value": 1,
                "label": "Older",
                "data": {
                    "needs": ["106", "101", "79", "82", "18", "27", "34", "33"],
                    "circumstances": ["196", "210"]
                }
            },
            {
                "value": 2,
                "label": "Unemployed",
                "data": {
                    "needs": ["95", "9", "112", "54", "11", "96", "51", "80", "48", "36", "67"],
                    "circumstances": ["185", "206", "215", "218", "222", "220"]
                }
            },
            {
                "value": 3,
                "label": "Low income",
                "data": {
                    "needs": ["122", "71", "111", "115", "67", "36", "66", "68"],
                    "circumstances": ["1", "191", "185", "165", "205", "210", "213", "218", "220"]
                }
            },
            {
                "value": 4,
                "label": "Young Family",
                "data": {
                    "needs": ["106", "101", "79", "82", "18", "27", "34", "33"],
                    "circumstances": ["196", "210"]
                }
            },
            {
                "value": 5,
                "label": "Disabled Person",
                "data": {
                    "needs": ["95", "9", "112", "54", "11", "96", "51", "80", "48", "36", "67"],
                    "circumstances": ["185", "206", "215", "218", "222", "220"]
                }
            }
        ]
    },
    "AQItems": [
        "67",
        "66",
        "115",
        "71",
        "68",
        "122",
        "96",
        "95",
        "113"
    ]
}

export default initial_data;