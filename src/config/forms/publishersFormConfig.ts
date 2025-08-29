import { 
  createPublishingHouseSchema, 
  updatePublishingHouseSchema, 
  CreatePublishingHouseFormData, 
  UpdatePublishingHouseFormData 
} from "@/services/validation/schemas/publishing-houses";
import { publishingHousesApi } from "@/services/api/entities/publishing-houses";
import { EntityFormConfig } from "@/types/forms";

export const publishersFormConfig: EntityFormConfig<CreatePublishingHouseFormData, UpdatePublishingHouseFormData> = {
  createSchema: createPublishingHouseSchema,
  updateSchema: updatePublishingHouseSchema,
  
  createFields: [
    { name: "name", label: "Nombre de la editorial", type: "text", placeholder: "Ej: Editorial Planeta" },
    { name: "country", label: "País", type: "text", placeholder: "Ej: España" },
    { name: "websiteUrl", label: "Sitio web", type: "text", placeholder: "https://www.editorial.com" }
  ],
  
  editFields: [
    { name: "name", label: "Nombre de la editorial", type: "text", placeholder: "Ej: Editorial Planeta" },
    { name: "country", label: "País", type: "text", placeholder: "Ej: España" },
    { name: "websiteUrl", label: "Sitio web", type: "text", placeholder: "https://www.editorial.com" }
  ],

  apiService: {
    create: publishingHousesApi.create
  },

  texts: {
    createSubmitText: "Crear Editorial",
    editSubmitText: "Actualizar Editorial",
    createLoadingText: "Creando editorial...",
    editLoadingText: "Actualizando editorial...",
    createSuccessMessage: "Editorial creada exitosamente",
    editSuccessMessage: "Editorial actualizada exitosamente"
  }
};