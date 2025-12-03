
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
        "id": "higher-pitched",
        "name": "¿Una voz más aguda se alinearía mejor con su identidad?",
        "type": "boolean"
    },
    {
        "target": "target1",
        "targetIndex": true,
        "switch": [
            {
                "id": "talker-listener",
                "name": "¿Eres más hablador o más oyente?",
                "list": [
                    {
                        "icon": "💬",
                        "title": "Hablador"
                    },
                    {
                        "icon": "👂",
                        "title": "Oyente"
                    }
                ]
            },
            {
                "id": "trust-communication",
                "targetIndex": 1,
                "name": "¿Crees que la confianza y la comunicación son claves en las relaciones?",
                "type": "boolean"
            }
        ]
    },
    {
        "target": "target1",
        "targetIndex": true,
        "type": "boolean",
        "switch": [
            {
                "id": "um-uh",
                "name": "¿Palabras de relleno como 'eh' y 'um' aparecen frecuentemente en tu habla?"
            },
            {
                "id": "brutally-relationships",
                "targetIndex": 1,
                "name": "¿Ser brutalmente honesto siempre es beneficioso en las relaciones?"
            }
        ]
    },
    {
        "id": "content",
        "name": "¿Qué tipo de contenido te resulta útil?",
        "description": "Entender mejor tu experiencia ayudará a que aproveches al máximo Vocal Image.",
        "type": "checkbox",
        "multiple": true,
        "optional": true,
        "list": [
            {
                "icon": "🎞",
                "title": "Videos"
            },
            {
                "icon": "🎙️",
                "title": "Podcasts"
            },
            {
                "icon": "📱",
                "title": "Shorts"
            },
            {
                "icon": "📰",
                "title": "Artículos"
            },
            {
                "icon": "📚",
                "title": "Libros"
            }
        ]
    },
    {
        "id": "native-speaker",
        "name": "¿Eres hablante<br>nativo de español?",
        "type": "boolean"
    },
    {
        "description": "Procesamiento preliminar...",
        "type": "progress",
        "rive": {
            "src": "data_proccessing_loader.riv",
            "stateMachines": "data_proccessing_loader", // ← Changed from "State Machine 1" to match actual name
            "width": 350,
            "height": 284
        }
    }
];
