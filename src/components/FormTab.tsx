// src/components/FormTab.tsx
import React, { useEffect, useState } from "react";
import type { RealEstate, RealEstateType } from "../types";
import { Button, Grid, Input, Stack, TextInput } from "@mantine/core";
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
  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState<boolean>(false);

  const handleSubmit = async (values: any) => {
    // if (!validate()) return;

    setSubmitting(true);
    try {
      const payload: Partial<RealEstate> = {
        ...values,
        country: String(values.country || "").toUpperCase(),
      };
      console.log("payload", payload);
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
    initialValues: { ...initial },

    validate: {
      name: (value) => (value ? null : "Name is required"),
      real_state_type: (value) => {
        if (!value) return "Type is required";
        if (!TYPES.includes(value as RealEstateType)) return "Invalid type";
        return null;
      },
    },
  });
  console.log("form values2", form.values);

  return (
    <form onSubmit={form.onSubmit((values) => handleSubmit(values))}>
      <Grid grow gutter="sm">
        <Grid.Col span={4}>
          {" "}
          <TextInput
            withAsterisk
            label="Name"
            placeholder="Name"
            key={form.values.id}
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
        <Grid.Col span={5}>
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
        <Grid.Col span={4}>
          <TextInput
            withAsterisk
            label="City"
            placeholder="City"
            key={form.key("city")}
            {...form.getInputProps("city")}
          />
        </Grid.Col>
        <Grid.Col span={4}>
          <TextInput
            withAsterisk
            label="Country"
            placeholder="Country"
            key={form.key("country")}
            {...form.getInputProps("country")}
          />
        </Grid.Col>
        <Grid.Col span={4}>
          <TextInput
            withAsterisk
            label="Rooms"
            placeholder="Rooms"
            key={form.key("rooms")}
            {...form.getInputProps("rooms")}
          />
        </Grid.Col>
        <Grid.Col span={4}>
          <TextInput
            withAsterisk
            label="Bathrooms"
            placeholder="Bathrooms"
            key={form.key("bathrooms")}
            {...form.getInputProps("bathrooms")}
          />
        </Grid.Col>
        <Grid.Col span={12}>
          <TextInput
            label="Comments"
            placeholder="Comments"
            key={form.key("comments")}
            {...form.getInputProps("comments")}
          />
        </Grid.Col>
      </Grid>

      <Button style={{ marginTop: 16 }} type="submit" loading={submitting}>
        {submitLabel}
      </Button>
    </form>
  );
}

function Error({ text }: { text?: string }) {
  if (!text) return null;
  return <div style={{ color: "crimson", fontSize: 12 }}>{text}</div>;
}
