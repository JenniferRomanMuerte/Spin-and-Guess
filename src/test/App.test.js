// tests/App.test.js
import { render, screen } from "@testing-library/react";
import App from "../components/App";

test("renders learn react link", () => {
  render(<App />);
  const elements = screen.getAllByText(/Hola mundo/i);
  expect(elements.length).toBe(1);
});