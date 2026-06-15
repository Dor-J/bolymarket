import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { EventListEmpty } from "./EventListEmpty";

describe("EventListEmpty", () => {
  it("renders empty copy for zero-result category filters", () => {
    render(<EventListEmpty />);

    expect(screen.getByText("No markets found")).toBeInTheDocument();
  });
});
