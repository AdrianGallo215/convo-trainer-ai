
export interface QuestionnaireItem {
    id?: string;
    name?: string;
    description?: string;
    type?: 'boolean' | 'info' | 'info-reverse' | 'switch' | 'inline' | 'checkbox' | 'progress' | 'line';
    target?: string | string[];
    targetIndex?: boolean | number;
    rive?: {
        image?: string;
        src: string;
        stateMachines?: string | string[]; // Allow array or string
        width?: number;
        height?: number;
        inputName?: string;
        value?: string;
        locale?: boolean;
        artboard?: string;
        data?: any;
        className?: string;
    };
    switch?: QuestionnaireItem[];
    list?: {
        id?: string;
        icon?: string;
        title: string;
        note?: string;
    }[];
    multiple?: boolean;
    optional?: boolean;
    btn?: string;
    note?: string;
    subheader?: string;
    h1?: boolean;
    checkbox?: boolean;
    "list-type"?: string;
    path?: string;
}

export const questionnaireData: QuestionnaireItem[] = [
    {
        "id": "goal",
        "name": "¿Cuál es tu objetivo principal al usar Convo Trainer?",
        "description": "Esto nos ayudará a personalizar tus ejercicios.",
        "type": "checkbox",
        "multiple": false,
        "list": [
            {
                "icon": "🚀",
                "title": "Superar la ansiedad social"
            },
            {
                "icon": "💼",
                "title": "Mejorar habilidades profesionales"
            },
            {
                "icon": "🗣️",
                "title": "Hablar con más fluidez"
            },
            {
                "icon": "🤝",
                "title": "Hacer amigos más fácilmente"
            }
        ]
    },
    {
        "id": "anxiety-level",
        "name": "En una escala del 1 al 10, ¿cuánta ansiedad sientes al hablar con desconocidos?",
        "type": "boolean" // Using boolean type for simple choice structure for now, though logic is handled by AI
    },
    {
        "id": "scenarios",
        "name": "¿Qué situaciones te resultan más difíciles?",
        "type": "checkbox",
        "multiple": true,
        "list": [
            {
                "icon": "👔",
                "title": "Entrevistas de trabajo"
            },
            {
                "icon": "🎤",
                "title": "Hablar en público"
            },
            {
                "icon": "🎉",
                "title": "Fiestas y/o eventos sociales"
            }
        ]
    },
    {
        "id": "feedback-style",
        "name": "¿Cómo prefieres recibir feedback?",
        "type": "boolean",
        "switch": [
            {
                "id": "feedback-pref",
                "name": "Estilo de corrección",
                "list": [
                    {
                        "icon": "🛡️",
                        "title": "Simple y motivador"
                    },
                    {
                        "icon": "🎯",
                        "title": "Directo y técnico"
                    }
                ]
            }
        ]
    },
    {
        "description": "Generando tu plan personalizado...",
        "type": "progress",
        "rive": {
            "src": "data_proccessing_loader.riv",
            "stateMachines": "data_proccessing_loader",
            "width": 350,
            "height": 284
        }
    }
];
