import { BASE_URL } from "@/config";
import { AccessError } from "./Errors/AccessError";
import { AuthError } from "./Errors/AuthError";
import { ValidationError } from "./Errors/ValidationError";
import {
  CreateTemplateDTO,
  DeleteTemplateDTO,
  UpdateTemplateDTO,
} from "./types/Template";

export class TemplateServiceDB {
  static async create(template: CreateTemplateDTO) {
    try {
      const response = await fetch(BASE_URL + "/templates", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
        body: JSON.stringify({ template: template }),
      });
      const json = await response.json();
      if (!response.ok) {
        if (response.status === 403) {
          throw new AccessError({ message: json.message });
        }
        if (response.status === 401) {
          throw new AuthError({ message: json.message });
        }

        if ("errors" in json) {
          throw new ValidationError({
            message: json.message,
            errors: json.errors,
          });
        }

        throw new Error(json.message);
      }
      return json;
    } catch (error) {
      throw error;
    }
  }

  static async delete({ id }: DeleteTemplateDTO) {
    try {
      const response = await fetch(BASE_URL + `/templates/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });
      const json = await response.json();
      if (!response.ok) {
        if (response.status === 403) {
          throw new AccessError({ message: json.message });
        }
        if (response.status === 401) {
          throw new AuthError({ message: json.message });
        }

        if ("errors" in json) {
          throw new ValidationError({
            message: json.message,
            errors: json.errors,
          });
        }

        throw new Error(json.message);
      }
      return json;
    } catch (error) {
      throw error;
    }
  }

  static async update(data: UpdateTemplateDTO) {
    try {
      const response = await fetch(BASE_URL + "/templates", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
        body: JSON.stringify({ template: data }),
      });
      const json = await response.json();
      if (!response.ok) {
        if (response.status === 403) {
          throw new AccessError({ message: json.message });
        }
        if (response.status === 401) {
          throw new AuthError({ message: json.message });
        }

        if ("errors" in json) {
          throw new ValidationError({
            message: json.message,
            errors: json.errors,
          });
        }

        throw new Error(json.message);
      }
      return json;
    } catch (error) {
      throw error;
    }
  }

  static async getAll() {
    try {
      const response = await fetch(BASE_URL + "/templates", {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });
      const json = await response.json();
      if (!response.ok) {
        if (response.status === 403) {
          throw new AccessError({ message: json.message });
        }
        if (response.status === 401) {
          throw new AuthError({ message: json.message });
        }

        if ("errors" in json) {
          throw new ValidationError({
            message: json.message,
            errors: json.errors,
          });
        }

        throw new Error(json.message);
      }
      return json;
    } catch (error) {
      throw error;
    }
  }

  static async getOne(id: Template["id"]) {
    try {
      const response = await fetch(BASE_URL + `/templates/${id}`, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });
      const json = await response.json();
      if (!response.ok) {
        if (response.status === 403) {
          throw new AccessError({ message: json.message });
        }
        if (response.status === 401) {
          throw new AuthError({ message: json.message });
        }

        if ("errors" in json) {
          throw new ValidationError({
            message: json.message,
            errors: json.errors,
          });
        }

        throw new Error(json.message);
      }
      return json;
    } catch (error) {
      throw error;
    }
  }

  static async duplicateSection(section_id: Section["id"]) {
    try {
      const response = await fetch(BASE_URL + `/sections/${section_id}`, {
        method: "POST",
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });
      const json = await response.json();
      if (!response.ok) {
        if (response.status === 403) {
          throw new AccessError({ message: json.message });
        }
        if (response.status === 401) {
          throw new AuthError({ message: json.message });
        }

        if ("errors" in json) {
          throw new ValidationError({
            message: json.message,
            errors: json.errors,
          });
        }

        throw new Error(json.message);
      }
      return json;
    } catch (error) {
      throw error;
    }
  }

  static async deleteSection(section_id: Section["id"]) {
    try {
      const response = await fetch(BASE_URL + `/sections/${section_id}`, {
        method: "DELETE",
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });
      const json = await response.json();
      if (!response.ok) {
        if (response.status === 403) {
          throw new AccessError({ message: json.message });
        }
        if (response.status === 401) {
          throw new AuthError({ message: json.message });
        }

        if ("errors" in json) {
          throw new ValidationError({
            message: json.message,
            errors: json.errors,
          });
        }

        throw new Error(json.message);
      }
      return json;
    } catch (error) {
      throw error;
    }
  }

  static async deletePlaceholder(placeholder_id: Placeholder["id"]) {
    try {
      const response = await fetch(
        BASE_URL + `/section-palceholders/${placeholder_id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );
      const json = await response.json();
      if (!response.ok) {
        if (response.status === 403) {
          throw new AccessError({ message: json.message });
        }
        if (response.status === 401) {
          throw new AuthError({ message: json.message });
        }

        if ("errors" in json) {
          throw new ValidationError({
            message: json.message,
            errors: json.errors,
          });
        }

        throw new Error(json.message);
      }
      return json;
    } catch (error) {
      throw error;
    }
  }

  static async createPlaceholders(placeholders: Omit<Placeholder, "id">[]) {
    try {
      const response = await fetch(BASE_URL + `/section-palceholders/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
        body: JSON.stringify({ placeholders: placeholders }),
      });
      const json = await response.json();
      if (!response.ok) {
        if (response.status === 403) {
          throw new AccessError({ message: json.message });
        }
        if (response.status === 401) {
          throw new AuthError({ message: json.message });
        }

        if ("errors" in json) {
          throw new ValidationError({
            message: json.message,
            errors: json.errors,
          });
        }

        throw new Error(json.message);
      }
      return json;
    } catch (error) {
      throw error;
    }
  }

  static async createSection(section: Omit<Section, "id">) {
    try {
      const response = await fetch(BASE_URL + `/sections/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
        body: JSON.stringify({ section: section }),
      });
      const json = await response.json();
      if (!response.ok) {
        if (response.status === 403) {
          throw new AccessError({ message: json.message });
        }
        if (response.status === 401) {
          throw new AuthError({ message: json.message });
        }

        if ("errors" in json) {
          throw new ValidationError({
            message: json.message,
            errors: json.errors,
          });
        }

        throw new Error(json.message);
      }
      return json;
    } catch (error) {
      throw error;
    }
  }
}
