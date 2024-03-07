import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";

const HandleNewItem = ({ onSubmit, fields, isLoading }) => {
  const defaultValues = fields.reduce((acc, item) => {
    acc[item.header.toLowerCase()] = "";
    return acc;
  }, {});

  const form = useForm({
    defaultValues: defaultValues,
  });

  const validateFormInput = (formData, cb) => {
    for (const key in formData) {
      const value = formData[key];

      if (value.trim().length < 2) {
        form.setError(key, {
          type: "required",
          message: "Length must be at least 2 symbol",
        });
        return;
      }
    }

    cb(formData);
  };

  return (
    <Form {...form}>
      <form
        className="flex flex-col gap-4 grow"
        onSubmit={form.handleSubmit((formData) =>
          validateFormInput(formData, onSubmit)
        )}
      >
        {fields.map((item) => {
          return (
            <FormField
              key={item.id}
              control={form.control}
              name={item.header.toLowerCase()}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="capitalize">{item.header}</FormLabel>
                  <FormControl>
                    <Input
                      type={
                        item.type === "text" || item.type === "slug"
                          ? "text"
                          : "url"
                      }
                      placeholder={item.header.toLowerCase()}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          );
        })}
        <Button
          disabled={isLoading}
          type="submit"
          size="sm"
          className="w-full mt-auto"
        >
          {isLoading ? (
            <Loader2
              className={cn(" h-4 w-4", {
                "animate-spin": isLoading,
              })}
            />
          ) : (
            "Create"
          )}
        </Button>
      </form>
    </Form>
  );
};

export default HandleNewItem;
