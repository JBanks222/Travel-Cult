// Quiz data for the travel archetype quiz
const quizData = {
    "archetypes": [
        "Pathfinder",
        "Connector", 
        "Time Traveler",
        "Hedonist",
        "Digital Drifter",
        "Culture Hacker",
        "Escape Artist",
        "Luxe Nomad",
        "Local Whisperer",
        "Chaos Pilot",
        "Spiritual Nomad",
        "Builder"
    ],
    "questions": [
        {
            "id": 1,
            "question": "What's your ideal first day in a new country?",
            "options": [
                { "text": "Wake up early, hike to a hidden spot", "archetype": "Pathfinder" },
                { "text": "Find a street food vendor and chat with locals", "archetype": "Connector" },
                { "text": "Take a guided tour through the old town and museums", "archetype": "Time Traveler" },
                { "text": "Check into a luxury stay, order room service", "archetype": "Luxe Nomad" }
            ]
        },
        {
            "id": 2,
            "question": "Which of these sounds most like your travel vibe?",
            "options": [
                { "text": "One-way ticket. No plan. Let's go.", "archetype": "Chaos Pilot" },
                { "text": "I'm going to learn this language while I'm there", "archetype": "Culture Hacker" },
                { "text": "I'm here to rest, reset, and journal", "archetype": "Spiritual Nomad" },
                { "text": "I'll be working remote, but catching sunsets too", "archetype": "Digital Drifter" }
            ]
        },
        {
            "id": 3,
            "question": "Pick a travel ritual:",
            "options": [
                { "text": "Always bring a camera for moments & ruins", "archetype": "Time Traveler" },
                { "text": "Save every spot to Google Maps before landing", "archetype": "Local Whisperer" },
                { "text": "Drop into a café and see who I meet", "archetype": "Connector" },
                { "text": "Book a facial or massage the first night", "archetype": "Hedonist" }
            ]
        },
        {
            "id": 4,
            "question": "What's your favorite type of trip?",
            "options": [
                { "text": "Volunteering or building something that lasts", "archetype": "Builder" },
                { "text": "A guided group tour across Europe", "archetype": "Connector" },
                { "text": "Living out of a backpack, country-hopping", "archetype": "Chaos Pilot" },
                { "text": "A retreat where I can fully unplug", "archetype": "Spiritual Nomad" }
            ]
        },
        {
            "id": 5,
            "question": "Choose a travel soundtrack:",
            "options": [
                { "text": "Soft jazz and a glass of wine", "archetype": "Hedonist" },
                { "text": "Old-school reggae and backpacker vibes", "archetype": "Pathfinder" },
                { "text": "Cinematic film scores", "archetype": "Time Traveler" },
                { "text": "Lo-fi hip hop while coding in a hostel", "archetype": "Digital Drifter" }
            ]
        },
        {
            "id": 6,
            "question": "What's in your suitcase?",
            "options": [
                { "text": "Crystals, essential oils, journal", "archetype": "Spiritual Nomad" },
                { "text": "Camera, walking shoes, old maps", "archetype": "Time Traveler" },
                { "text": "Power bank, laptop, multiple SIM cards", "archetype": "Digital Drifter" },
                { "text": "Sketchbook and paint, work gloves", "archetype": "Builder" }
            ]
        },
        {
            "id": 7,
            "question": "Which of these would you rather do on vacation?",
            "options": [
                { "text": "Plan a surprise for locals or fellow travelers", "archetype": "Local Whisperer" },
                { "text": "Host a language exchange or join one", "archetype": "Culture Hacker" },
                { "text": "Spend the day getting pampered at a spa", "archetype": "Hedonist" },
                { "text": "Go completely off-grid for a while", "archetype": "Escape Artist" }
            ]
        },
        {
            "id": 8,
            "question": "Pick a caption for your next travel photo:",
            "options": [
                { "text": "\"Got lost and found everything.\"", "archetype": "Chaos Pilot" },
                { "text": "\"Booked this on points and vibes.\"", "archetype": "Digital Drifter" },
                { "text": "\"Recharging in a place that heals.\"", "archetype": "Spiritual Nomad" },
                { "text": "\"Woke up in a castle today. Casual.\"", "archetype": "Luxe Nomad" }
            ]
        },
        {
            "id": 9,
            "question": "Your ideal travel group would be:",
            "options": [
                { "text": "Just me and my journal", "archetype": "Escape Artist" },
                { "text": "A small group of curious strangers", "archetype": "Connector" },
                { "text": "A co-working tribe of digital nomads", "archetype": "Digital Drifter" },
                { "text": "A volunteering crew building something meaningful", "archetype": "Builder" }
            ]
        },
        {
            "id": 10,
            "question": "You're most likely to post a story about:",
            "options": [
                { "text": "That hole-in-the-wall café no one knows", "archetype": "Local Whisperer" },
                { "text": "An ancient ritual or cultural festival", "archetype": "Culture Hacker" },
                { "text": "A luxury suite overlooking the ocean", "archetype": "Luxe Nomad" },
                { "text": "A mountain sunrise after a tough climb", "archetype": "Pathfinder" }
            ]
        },
        {
            "id": 11,
            "question": "You travel mostly to:",
            "options": [
                { "text": "Find your purpose or deepen your practice", "archetype": "Spiritual Nomad" },
                { "text": "Chase adrenaline and motion", "archetype": "Chaos Pilot" },
                { "text": "Live better, softer, and slower", "archetype": "Hedonist" },
                { "text": "Connect, help, and contribute", "archetype": "Builder" }
            ]
        },
        {
            "id": 12,
            "question": "If you had one free month, you'd:",
            "options": [
                { "text": "Wander alone through ancient cities", "archetype": "Time Traveler" },
                { "text": "Disguise yourself and live like a local", "archetype": "Culture Hacker" },
                { "text": "Work on a creative or community project abroad", "archetype": "Builder" },
                { "text": "Go somewhere with no cell signal", "archetype": "Escape Artist" }
            ]
        }
    ]
};

// Archetype descriptions and benefits
const archetypeInfo = {
    "Pathfinder": {
        description: "You seek adventure, discovery, and the road less traveled. You're drawn to exploration and finding hidden gems.",
        benefits: [
            "Exclusive access to off-the-beaten-path destinations",
            "Adventure travel packages with expert guides",
            "Hiking and outdoor activity recommendations",
            "Connection with fellow adventure seekers"
        ]
    },
    "Connector": {
        description: "You travel to build relationships and bridge cultures. You're a social butterfly who thrives on human connection.",
        benefits: [
            "Group travel experiences with like-minded travelers",
            "Cultural exchange programs and language learning",
            "Social events and networking opportunities",
            "Community-building travel initiatives"
        ]
    },
    "Time Traveler": {
        description: "You're fascinated by history and culture. You travel to experience the past and understand how it shapes the present.",
        benefits: [
            "Historical tours with expert guides",
            "Museum and cultural site access",
            "Educational travel programs",
            "Heritage and preservation experiences"
        ]
    },
    "Hedonist": {
        description: "You travel for pleasure, comfort, and sensory experiences. You believe in treating yourself and enjoying life's luxuries.",
        benefits: [
            "Luxury spa and wellness retreats",
            "Fine dining and culinary experiences",
            "Premium accommodation upgrades",
            "VIP treatment and exclusive access"
        ]
    },
    "Digital Drifter": {
        description: "You combine work and wanderlust. You're a modern nomad who can work from anywhere while exploring the world.",
        benefits: [
            "Co-working space memberships worldwide",
            "Digital nomad community access",
            "Work-friendly accommodation options",
            "Productivity and networking events"
        ]
    },
    "Culture Hacker": {
        description: "You dive deep into local cultures and languages. You want to understand and integrate into the places you visit.",
        benefits: [
            "Language immersion programs",
            "Cultural workshops and classes",
            "Local community integration opportunities",
            "Authentic cultural experiences"
        ]
    },
    "Escape Artist": {
        description: "You travel to disconnect and find solitude. You seek peace and quiet away from the noise of everyday life.",
        benefits: [
            "Remote and secluded destination access",
            "Digital detox retreats",
            "Peaceful accommodation options",
            "Mindfulness and wellness programs"
        ]
    },
    "Luxe Nomad": {
        description: "You travel in style and comfort. You appreciate the finer things in life and expect quality experiences.",
        benefits: [
            "Luxury accommodation and transportation",
            "Concierge services and personal assistance",
            "Exclusive access to premium experiences",
            "VIP treatment and priority booking"
        ]
    },
    "Local Whisperer": {
        description: "You have an uncanny ability to find authentic local experiences. You know where the locals go and how to blend in.",
        benefits: [
            "Insider access to local hotspots",
            "Authentic local experience recommendations",
            "Community connection opportunities",
            "Hidden gem destination access"
        ]
    },
    "Chaos Pilot": {
        description: "You embrace spontaneity and unpredictability. You thrive on the unknown and love the thrill of unplanned adventures.",
        benefits: [
            "Last-minute travel deals and opportunities",
            "Spontaneous adventure packages",
            "Flexible booking options",
            "Thrill-seeking experience access"
        ]
    },
    "Spiritual Nomad": {
        description: "You travel to recharge, reconnect, and rediscover your inner self. You seek meaning and personal growth.",
        benefits: [
            "Spiritual and wellness retreats",
            "Meditation and mindfulness programs",
            "Personal growth and transformation experiences",
            "Connection with spiritual communities"
        ]
    },
    "Builder": {
        description: "You travel to create, contribute, and leave a positive impact. You want to build something meaningful and lasting.",
        benefits: [
            "Volunteer and service opportunities",
            "Community development projects",
            "Social impact travel experiences",
            "Skill-building and contribution programs"
        ]
    }
}; 