import { Button as BaseButton } from "@base-ui/react/button";
import { type VariantProps } from "class-variance-authority";
import type { LinkProps } from "react-router";
import { Link } from "react-router";

import { cn } from "@/lib/utils";

import { buttonVariants } from "./buttonVariants";

function Button({
  className,
  variant,
  size,
  ...props
}: BaseButton.Props & VariantProps<typeof buttonVariants>) {
  return (
    <BaseButton
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export interface ButtonLinkProps extends LinkProps {
  variant?: VariantProps<typeof buttonVariants>["variant"];
  size?: VariantProps<typeof buttonVariants>["size"];
}

const ButtonLink = ({ className, variant, size, ...props }: ButtonLinkProps) => {
  return <Link className={cn(buttonVariants({ variant, size, className }))} {...props} />;
};

export { Button, ButtonLink };
