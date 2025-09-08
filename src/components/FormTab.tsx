// src/components/FormTab.tsx
import React, { useEffect, useState } from "react";
import type { RealEstate, RealEstateType } from "../types";
import { Button, Grid, Input, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";

interface FormTabProps {
  initial?: Partial<RealEstate> | null;
  submitLabel: string;
  onSubmit: (payload: Partial<RealEstate>) => Promise<void>;
}

type Errors = Record<string, string>;

const TYPES: RealEstateType[] = [
  "house",
  "department",
  "land",
  "commercial_ground",
];

export default function FormTab({
  initial,
  submitLabel,
  onSubmit,
}: FormTabProps) {
  const [_, setForm] = useState<Partial<RealEstate>>({
    name: "",
    real_state_type: "house",
    street: "",
    external_number: "",
    internal_number: "",
    neighborhood: "",
    city: "",
    country: "US",
    rooms: 0,
    bathrooms: 0,
    comments: "",
    ...(initial ?? {}),
  });
  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState<boolean>(false);

  useEffect(() => {
    if (initial) setForm((f) => ({ ...f, ...initial }));
  }, [initial]);

  const set = (k: keyof RealEstate, v: unknown) =>
    setForm((f) => ({ ...f, [k]: v as any }));

  //   const validate = (): boolean => {
  //     const e: Errors = {};
  //     const type = String(form.real_state_type || "house") as RealEstateType;
  //     const needsInternal = ["department", "commercial_ground"].includes(type);

  //     if (needsInternal && !form.internal_number) {
  //       e.internal_number = "Required for department/commercial_ground.";
  //     }
  //     if (
  //       Number(form.bathrooms ?? 0) === 0 &&
  //       !["land", "commercial_ground"].includes(type)
  //     ) {
  //       e.bathrooms = "Zero bathrooms only allowed for land/commercial_ground.";
  //     }
  //     if (!/^[A-Za-z0-9-]+$/.test(String(form.external_number || ""))) {
  //       e.external_number = "Use letters, numbers or dash.";
  //     }
  //     if (!/^[A-Za-z]{2}$/.test(String(form.country || ""))) {
  //       e.country = "Two-letter code (e.g. US).";
  //     }

  //     setErrors(e);
  //     return Object.keys(e).length === 0;
  //   };

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    // if (!validate()) return;

    setSubmitting(true);
    try {
      const payload: Partial<RealEstate> = {
        ...form,
        country: String(_.country || "").toUpperCase(),
      };
      await onSubmit(payload);
      setErrors({});
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };
  const form = useForm({
    mode: "uncontrolled",
    initialValues: {
      email: "",
      termsOfService: false,
    },

    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : "Invalid email"),
    },
  });
  return (
    <form onSubmit={form.onSubmit((values) => console.log(values))}>
      <Grid grow gutter="sm">
        <Grid.Col span={4}>
          {" "}
          <TextInput
            withAsterisk
            label="Name"
            placeholder="Name"
            key={form.key("name")}
            {...form.getInputProps("name")}
          />
        </Grid.Col>
        <Grid.Col span={4}>
          <TextInput
            withAsterisk
            label="Type"
            placeholder="Type"
            key={form.key("real_state_type")}
            {...form.getInputProps("real_state_type")}
          />
        </Grid.Col>
        <Grid.Col span={4}>
          {" "}
          <TextInput
            withAsterisk
            label="Street"
            placeholder="Street"
            key={form.key("street")}
            {...form.getInputProps("street")}
          />
        </Grid.Col>
        <Grid.Col span={4}>
          <TextInput
            withAsterisk
            label="External Number"
            placeholder="External Number"
            key={form.key("external_number")}
            {...form.getInputProps("external_number")}
          />
        </Grid.Col>
        <Grid.Col span={4}>
          <TextInput
            label="Internal Number"
            placeholder="Internal Number"
            key={form.key("internal_number")}
            {...form.getInputProps("internal_number")}
          />
        </Grid.Col>
        <Grid.Col span={4}>
          <TextInput
            withAsterisk
            label="Neighborhood"
            placeholder="Neighborhood"
            key={form.key("neighborhood")}
            {...form.getInputProps("neighborhood")}
          />
        </Grid.Col>
      </Grid>
      <Grid.Col span={4}>
        <TextInput
          withAsterisk
          label="City"
          placeholder="City"
          key={form.key("city")}
          {...form.getInputProps("city")}
        />
      </Grid.Col>
      <TextInput
        withAsterisk
        label="Country"
        placeholder="Country"
        key={form.key("country")}
        {...form.getInputProps("country")}
      />
      <TextInput
        withAsterisk
        label="Rooms"
        placeholder="Rooms"
        key={form.key("rooms")}
        {...form.getInputProps("rooms")}
      />
      <TextInput
        withAsterisk
        label="Bathrooms"
        placeholder="Bathrooms"
        key={form.key("bathrooms")}
        {...form.getInputProps("bathrooms")}
      />
      <TextInput
        label="Comments"
        placeholder="Comments"
        key={form.key("comments")}
        {...form.getInputProps("comments")}
      />
      <Button type="submit" loading={submitting}>
        {submitLabel}
      </Button>
    </form>
  );
}

function Error({ text }: { text?: string }) {
  if (!text) return null;
  return <div style={{ color: "crimson", fontSize: 12 }}>{text}</div>;
}
