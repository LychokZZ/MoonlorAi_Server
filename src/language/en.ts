export const TextDashboard = {
    Username: 'User',
    Level: 'Level',
    Rating: 'in ranking',
    LeaderBoard: 'Leaderboard',
    Achievments: 'Achievements',
    NextLvl: 'to next level',
    Text: [
        { Title: 'Meditations', Paragraph: 'Practice calmness' },
        { Title: 'AI Chats', Paragraph: 'Choose your type' },
        { Title: 'Statistics', Paragraph: 'Your progress' },
        { Title: 'Psychologists', Paragraph: 'Find a specialist' }
    ]
}

export const TextMedetation = {
    HeadMeds: 'Meditations',
    HeadMed: 'Meditation',

    Title: 'Find Your Inner Peace',
    Paragraph: 'Practices designed for your comfort',
    MedetationList: [
        {
            id: 1,
            Icon: '/ImageMed/im1.jpeg',
            Type: 'Morning',
            Name: 'Morning Meditation',
            Title: 'Start your day with a positive mindset',
            Time: 10
        },
        {
            id: 2,
            Icon: '/ImageMed/im2.jpeg',
            Type: 'Evening',
            Name: 'Calm Before Sleep',
            Title: 'Relax and prepare for a healthy sleep',
            Time: 15
        },
        {
            id: 3,
            Icon: '/ImageMed/im3.jpeg',
            Type: 'Express',
            Name: 'Breathing Exercises',
            Title: 'A quick practice to relieve stress',
            Time: 5
        }
    ]
}


export const AddsTextAiChats = {
    Name: 'Choose Your AI Assistant',
    Time: 'min per response',
    Join: 'Join Now',
    Buy: 'View Offers',
    Title: 'Each chat is tailored to your needs',
    ChatList: [
        {
            Name: 'General',
            Title: 'Free conversation: the user can talk about anything, and the bot listens, supports, and gives basic advice.',
            Subscription: true
        },
        {
            Name: 'Anxiety Relief',
            Title: 'Chat for reducing anxiety and stress: breathing exercises, grounding techniques, and supportive words.',
            Subscription: false
        },
        {
            Name: 'Anti-Depression',
            Title: 'Support during apathy or low mood: warm conversation, motivation, and small steps forward.',
            Subscription: false
        },
        {
            Name: 'Motivational',
            Title: 'Focus on goals and productivity: advice on how to act, plan, and stay motivated.',
            Subscription: false
        },
        {
            Name: 'Self-Esteem',
            Title: 'Building confidence and a positive attitude toward yourself, developing inner strength.',
            Subscription: false
        },
        {
            Name: 'Relationships',
            Title: 'Conversation about romantic or personal relationships, support in conflicts and emotions.',
            Subscription: false
        }
    ]
}


export const StatasText = {
    Header: 'Statistics',
    Stats: ['Meditations Completed', 'Average Mood', 'Practice Hours'],
    Mounth: 'this month',
    TitleMood: 'Mood This Week',
    Week: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    TitleSesions: 'Recent Sessions',
    Session: [
        { Name: 'Morning Meditation', Date: 'Today, 08:00', Time: '10 min' },
        { Name: 'Breathing Exercises', Date: 'Yesterday, 14:30', Time: '5 min' },
        { Name: 'Calm Before Sleep', Date: 'Yesterday, 22:00', Time: '15 min' }
    ]
}

export const AchivmentsText = {
    Header: 'Achievements',
    Open: 'Completed',
    Progres: 'Progress',
    Basic: '#Basic',
    Rare: '#Rare',
    Epic: '#Epic',
    Legendary: '#Legendary',

    Achivments: [
        {
            Title: 'First Login',
            Xp: 20,
            Description: 'Congratulations on your first login to our app! You have taken the first step towards improving your mental well-being with the help of an AI psychologist. Keep exploring and using all the features we offer to support your journey to wellness.',
            AchivTitle: 'Complete Login',
            Type: 'basic',
        },
        {
            Title: 'First Steps',
            Xp: 50,
            Description: 'Congratulations on completing your first meditation! This is an important step towards improving your mental health and well-being. Keep practicing meditation to feel more calm, focused, and balanced in your life.',
            AchivTitle: 'Complete First Meditation',
            Type: 'basic',
        },
        {
            Title: 'Weekly Marathon',
            Xp: 200,
            Description: 'Congratulations on successfully completing the weekly meditation marathon! Your dedication to improving your mental health is inspiring. Keep up this positive habit to experience even more benefits.',
            AchivTitle: 'Meditate 7 Days in a Row',
            Type: 'rare',
        },
        {
            Title: 'Discipline Master',
            Xp: 500,
            Description: 'Congratulations on reaching an incredible milestone — 30 days of meditation in a row! Your commitment and discipline are a true example to follow. Keep up this positive habit to maintain your mental health and well-being at a high level.',
            AchivTitle: 'Meditate 30 Days in a Row',
            Type: 'epic',
        },
        {
            Title: 'Enlightened',
            Xp: 1000,
            Description: 'Congratulations on achieving an impressive milestone — completing 100 meditations! Your dedication and perseverance in meditation practice are truly inspiring. Continue this positive habit to support your mental health and well-being at a high level.',
            AchivTitle: 'Complete 100 Meditations',
            Type: 'legendary',
        },
        {
            Title: 'First Conversation',
            Xp: 30,
            Description: 'Congratulations on starting your first conversation with the AI psychologist! This is an important step towards improving your mental health and well-being. Keep using this opportunity to get support and advice from our AI psychologist.',
            AchivTitle: 'Start Chat with AI Psychologist',
            Type: 'basic',
        },
        {
            Title: 'Heartfelt Talk',
            Xp: 150,
            Description: 'Congratulations on reaching an important milestone — sending 50 messages in the AI psychologist chat! Your active participation is key to improving your mental health and well-being. Keep using this opportunity to receive support and advice from our AI psychologist.',
            AchivTitle: 'Send 50 Messages',
            Type: 'rare',
        },
        {
            Title: 'Communication Master',
            Xp: 750,
            Description: 'Congratulations on reaching an impressive milestone — sending 500 messages in the AI psychologist chat! Your active participation is key to improving your mental health and well-being. Keep using this opportunity to receive support and advice from our AI psychologist.',
            AchivTitle: 'Send 500 Messages',
            Type: 'epic',
        },
        {
            Title: 'Personality',
            Xp: 100,
            Description: 'Congratulations on completing your profile! This is an important step towards improving your experience using our app. Completing your profile helps us better understand your needs and provide more personalized support for your mental health and well-being.',
            AchivTitle: 'Complete Profile',
            Type: 'basic',
        },
        {
            Title: 'Experienced Practitioner',
            Xp: 300,
            Description: 'Congratulations on reaching level 10! Your progress is proof of your dedication to improving your mental health and well-being. Keep using all the features we offer to support you on your wellness journey.',
            AchivTitle: 'Reach Level 10',
            Type: 'rare',
        },
        {
            Title: 'Meditation Master',
            Xp: 1500,
            Description: 'Congratulations on reaching level 25! Your progress is proof of your dedication to improving your mental health and well-being. Keep using all the features we offer to support you on your wellness journey.',
            AchivTitle: 'Reach Level 25',
            Type: 'legendary',
        },
    ]
}

export const LeaderBoardText = {
    Header: 'Leaderboard',
    Username: 'Username',
    YouPosition: 'Your Position',
    Level: 'Level',
    AddXp: 'How to Earn XP?',
    FirstXP: 'Complete meditations (+50 XP)',
    SecondXp: 'Chat in AI chat (+5 XP per message)',
    ThridXp: 'Complete daily tasks (up to +100 XP)',
    FourthXp: 'Visit the app daily (+20 XP per day)',
}

export const SettingText = {
    NameBlock: 'Settings',
    NameBlockSafe: 'Security',
    Safe: 'Change Password',
    SafeTitle: 'Update your password',

    OtherBlock: 'Other',
    OtherName: 'Help & Support',
    OtherTitle: 'FAQ, Contacts',

    Leave: 'Log Out',
    Settings: [
        {
            Push: 'Notifications',
            PushTitle: 'Push notifications and email',
            On: false,
            Type: 'Switch'
        },
        {
            Push: 'App Theme',
            PushTitle: 'Change the app theme',
            On: false,
            Type: 'Switch'
        },
        {
            Push: 'Language',
            Type: 'Arrow'
        }
    ],
}

export const MainLandPageText = {
    Title: 'MoonlorAI',
    Login: 'Log in',
    Start: 'Start for free',
    TitleHeader: 'Mental health platform',
    BigTitleOne: 'Your personal',
    BigTitleTwo: 'psychologist in your smartphone',
    Paragraph:
        'AI support 24/7, professional psychologists, meditations, and a unique blockchain-based gamification system. Everything for your mental well-being.',
    List: {
        Safe: 'Safe',
        Confidential: 'Confidential',
        Convenient: 'Convenient',
    },
    Users: 'Users',
    Psyhologist: 'Psychologists',
    Medetation: 'Meditations',
    Recomendaation: 'Recommendations',

    InfoList: [
        {
            Title: 'Meditations',
            Addition: 'and practices',
            Paragraph:
                'A collection of guided meditations for various needs: from stress relief to better sleep',
            Smaller: 'New meditation every week',
        },
        {
            Title: 'AI assistants',
            Addition: 'consultants',
            Paragraph:
                'Get 24/7 support from specialized AI assistants in different areas of psychological care',
            Smaller: 'Unlimited chats in the Pro plan',
        },
        {
            Title: 'Gamification',
            Addition: 'and rewards',
            Paragraph:
                'Turn self-care for your mental health into an engaging journey',
            Smaller: 'Through play — to inner balance',
        },
        {
            Title: 'Web3',
            Addition: 'integration',
            Paragraph:
                'The first mental health platform with verified achievements on the blockchain',
            Smaller: 'Ethereum and Polygon support',
        },
        {
            Title: 'Psychologists',
            Addition: 'professionals',
            Paragraph:
                'A marketplace of verified specialists in various fields of psychology',
            Smaller: 'Confidential video consultations',
        },
    ],
    Turbota: 'Start taking care of yourself today',
    Join:
        'Join thousands of users who have already improved their mental health with MindCare',
    Subs:
        'No card required • Cancel anytime • First 7 days free',
    Prava: '© 2025 MoonlorAI. All rights reserved.',
    Links: ['Policy', 'Terms', 'Contacts'],
};
