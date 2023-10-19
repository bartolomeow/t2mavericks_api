
export const prompts = {

    userStoriesTemplate : `
    A partir de un workshop de ideación, se han listado una serie de ideas a desarrollar en un proyecto agile.
    Para cada una de las siguientes ideas, genera como si fuera un proyecto agile, sus features y sus user stories para llevarlas a cabo.
    Para cada User Story, genera su Definition of Ready, Definition of Done y una estimación de horas para realizarla. Se generoso con las horas.
    Genera tambien un Nombre para el proyecto y una descripción del mismo basandote en las ideas.
    Además, genera un apartado de features y user stories adicionales que creas que puedan aportar valor al proyecto, en el apartado de aiFeatures.
    Las ideas son las siguientes:
    {inceptionIdeas}

    El output tiene que ser en formato JSON, con la siguiente estructura:
    {outputExample}

    Asegurate que el JSON es correcto, tiene el formato correcto y que no hay errores de sintaxis.
    `,
    outputExample : `
    {
        "title": "Título del proyecto",
        "description": "Descripción del proyecto",
        "features": [
            {
                "name": "Nombre de la épica",
                "description": "Descripción de la épica",
                "userStories": [
                    {
                        "name": "Nombre de la user story",
                        "description": "Descripción de la user story",
                        "definitionOfReady": "Definition of Ready de la user story",
                        "definitionOfDone": "Definition of Done de la user story",
                        "hours": "30"
                    }
                ]
            }
        ],
        "aiFeatures": [
            {
                "name": "Nombre de la épica",
                "description": "Descripción de la épica",
                "userStories": [
                    {
                        "name": "Nombre de la user story",
                        "description": "Descripción de la user story",
                        "definitionOfReady": "Definition of Ready de la user story",
                        "definitionOfDone": "Definition of Done de la user story",
                        "hours": "30"
                    }
                ]
            }
        ]
    }
    
    `,
   
    documentatorTemplateIniciative: `
    Generate documentation for the main initiative based on the information provided in the Excel document. The main initiative represents the core objective of the project and encompasses its overarching goals and purposes.
    
    Initiative
    Extract and elaborate on the main initiative from the Excel data. Include details such as:
    
    Goals: Describe the specific objectives the initiative aims to achieve.
    Purpose: Explain the broader purpose or problem that the initiative addresses.
    Stakeholders: Identify key stakeholders or target audience involved in the initiative.
    Ensure that the documentation is clear and concise, providing a comprehensive understanding of the main initiative.

    The output must be with Markdown format and Spanish.
    Input: {iniciativeJSON}
    `,
    documentatorTemplateFeatures: `Generate a comprehensive project documentation in Markdown format for a new software feature based on the provided information. Use the following template as a guideline:

    The output must be with Markdown format and Spanish. Check that the MD generated can compile correctly.

    Structure:

    ### Feature:

    - **RallyID:**
    - **RallyURL:**

    **Description:**

    #### User Stories:

    #### Configuration Details:

    Example:

        Input: {InputJSONFeatures}
        Output: ### Feature: Crear plataforma de registro\n\n-  **FeatureID:** [ID del Rally]\n\n - **RallyURL:** [URL del Rally]\n\n**Descripción:**\nEsta característica tiene como objetivo permitir a los usuarios registrarse en la plataforma de ideación. Es esencial para el proyecto ya que sin un sistema de registro, los usuarios no podrán acceder a las funcionalidades de la plataforma.\n\n#### Historias de Usuario:\n\n| **Título de la Historia de Usuario** | **Descripción** | **Criterios de Aceptación** |\n|----------------------|------------------------------|---------------------------------------------|\n| Registro de usuarios | Como usuario, quiero poder registrarme en la plataforma de ideación |El usuario puede registrarse exitosamente y se almacenan sus datos en la base de datos| El usuario puede registrarse exitosamente y se almacenan sus datos en la base de datos | Inicio de sesión de usuarios | Como usuario registrado, quiero poder iniciar sesión en la plataforma de ideación   | - El usuario puede iniciar sesión exitosamente y se le redirige a la página principal |
    
    Real case:
    
        Input:{FeatureJSON}
        Output:
    `,
    
    documentadorTemplateUserStories: `
    Generate a detailed Markdown documentation for a user story based on the provided information. Use the following template as a guideline:

    The output must be with Markdown format and Spanish.

    Structure:

    ## User Story:

    - **Owner:**
    - **RallyID:**
    - **RallyURL:**
    - **Developer:**
    - **Sprint:**

    ###Development Summary:###
    **Objective:**

    **Requirements:**

    **Development Details:**

    **Acceptance Criteria:**

    **Development Steps:**

    **Testing Steps:**
   
    **Configuration Details:**

    **Documentation:**

    **Notes:**

    Example:
        
        Input:{InputJSONUserStories}
        Output:

    Real Case:
        Input:{UserStoryJSON}
        Output:
    `,
    InputJSONFeatures: `{
        "name": "Crear plataforma de registro",
        "description": "Permitir a los usuarios registrarse en la plataforma de ideación",
        "userStories": [
            {
                "name": "Registro de usuarios",
                "description": "Como usuario, quiero poder registrarme en la plataforma de ideación",
                "definitionOfReady": "La página de registro está diseñada y lista para ser implementada",
                "definitionOfDone": "El usuario puede registrarse exitosamente y se almacenan sus datos en la base de datos",
                "hours": "10"
            },
            {
                "name": "Inicio de sesión de usuarios",
                "description": "Como usuario registrado, quiero poder iniciar sesión en la plataforma de ideación",
                "definitionOfReady": "La página de inicio de sesión está diseñada y lista para ser implementada",
                "definitionOfDone": "El usuario puede iniciar sesión exitosamente y se le redirige a la página principal",
                "hours": "8"
            }
        ]
    }`,
    InputJSONUserStories: `{
            "name": "Registro de usuarios",
            "description": "Como usuario, quiero poder registrarme en la plataforma de ideación",
            "definitionOfReady": "La página de registro está diseñada y lista para ser implementada",
            "definitionOfDone": "El usuario puede registrarse exitosamente y se almacenan sus datos en la base de datos",
            "hours": "10"
        }`,
}
