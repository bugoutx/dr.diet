"use client";

import {
  Children,
  cloneElement,
  createContext,
  isValidElement,
  useContext,
  useRef,
  type ReactElement,
  type ReactNode,
} from "react";
import { motion, useInView, type HTMLMotionProps } from "framer-motion";
import { useReducedMotion, useMotionDuration } from "./useReducedMotion";
import {
  REVEAL_EASE,
  REVEAL_VIEWPORT,
  REVEAL_DISTANCE,
  STAGGER_DELAY,
  REDUCED_MOTION_DURATION,
} from "./revealConfig";

export type RevealVariant = "fadeUp" | "fadeIn" | "fadeLeft" | "fadeRight" | "staggerParent";

type StaggerContextValue = {
  inView: boolean;
  reducedMotion: boolean;
  duration: number;
};

const StaggerContext = createContext<StaggerContextValue | null>(null);

function useStaggerContext() {
  return useContext(StaggerContext);
}

type RevealBaseProps = {
  variant: RevealVariant;
  delay?: number;
  className?: string;
  children?: ReactNode;
  as?: keyof typeof motion;
};

function getVariants(
  variant: Exclude<RevealVariant, "staggerParent">,
  reducedMotion: boolean,
  duration: number,
  customDelay = 0
) {
  const transition = {
    duration: reducedMotion ? REDUCED_MOTION_DURATION : duration,
    ease: REVEAL_EASE,
    delay: customDelay,
  };

  if (reducedMotion) {
    return {
      hidden: { opacity: 0 },
      visible: { opacity: 1, transition },
    };
  }

  const d = REVEAL_DISTANCE;

  switch (variant) {
    case "fadeUp":
      return {
        hidden: { opacity: 0, y: d.y },
        visible: { opacity: 1, y: 0, transition },
      };
    case "fadeIn":
      return {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition },
      };
    case "fadeLeft":
      return {
        hidden: { opacity: 0, x: d.x },
        visible: { opacity: 1, x: 0, transition },
      };
    case "fadeRight":
      return {
        hidden: { opacity: 0, x: -d.x },
        visible: { opacity: 1, x: 0, transition },
      };
    default:
      return {
        hidden: { opacity: 0, y: d.y },
        visible: { opacity: 1, y: 0, transition },
      };
  }
}

export function Reveal({
  variant,
  delay = 0,
  className,
  children,
  as = "div",
  ...rest
}: RevealBaseProps & Omit<HTMLMotionProps<"div">, "initial" | "animate" | "variants">) {
  const reducedMotion = useReducedMotion();
  const duration = useMotionDuration();

  if (variant === "staggerParent") {
    return (
      <RevealStaggerParent
        reducedMotion={reducedMotion}
        duration={duration}
        className={className}
        as={as}
        {...rest}
      >
        {children}
      </RevealStaggerParent>
    );
  }

  const variants = getVariants(variant, reducedMotion, duration, delay);
  const MotionComponent = motion[as] as typeof motion.div;

  return (
    <MotionComponent
      initial="hidden"
      whileInView="visible"
      viewport={REVEAL_VIEWPORT}
      variants={variants}
      className={className}
      {...rest}
    >
      {children}
    </MotionComponent>
  );
}

function RevealStaggerParent({
  reducedMotion,
  duration,
  className,
  children,
  as = "div",
  ...rest
}: {
  reducedMotion: boolean;
  duration: number;
  className?: string;
  children?: ReactNode;
  as?: keyof typeof motion;
} & Omit<HTMLMotionProps<"div">, "initial" | "animate" | "variants">) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: REVEAL_VIEWPORT.amount });

  const value: StaggerContextValue = {
    inView,
    reducedMotion,
    duration,
  };

  const MotionComponent = motion[as] as typeof motion.div;

  let staggerIndex = 0;
  const processedChildren = Children.map(children, (child) => {
    if (!isValidElement(child)) return child;
    const el = child as ReactElement<{ staggerIndex?: number }>;
    const next = cloneElement(el, { staggerIndex: staggerIndex++ });
    return next;
  });

  return (
    <StaggerContext.Provider value={value}>
      <MotionComponent
        ref={ref}
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
        variants={{
          hidden: {},
          visible: {
            transition: {
              staggerChildren: STAGGER_DELAY,
              delayChildren: 0.06,
            },
          },
        }}
        className={className}
        {...rest}
      >
        {processedChildren}
      </MotionComponent>
    </StaggerContext.Provider>
  );
}

export type RevealItemVariant = "fadeUp" | "fadeIn" | "fadeLeft" | "fadeRight";

export type RevealItemProps = {
  variant?: RevealItemVariant;
  staggerIndex?: number;
  className?: string;
  children?: ReactNode;
  as?: keyof typeof motion;
} & Omit<HTMLMotionProps<"div">, "initial" | "animate" | "variants">;

export function RevealItem({
  variant = "fadeUp",
  staggerIndex = 0,
  className,
  children,
  as = "div",
  ...rest
}: RevealItemProps) {
  const ctx = useStaggerContext();

  const reducedMotion = ctx?.reducedMotion ?? false;
  const duration = ctx?.duration ?? 0.55;
  const staggerDelay = ctx ? staggerIndex * STAGGER_DELAY : 0;

  const variants = getVariants(variant, reducedMotion, duration, staggerDelay);
  const MotionComponent = motion[as] as typeof motion.div;

  if (!ctx) {
    return (
      <MotionComponent initial="hidden" animate="visible" variants={variants} className={className} {...rest}>
        {children}
      </MotionComponent>
    );
  }

  return (
    <MotionComponent
      initial="hidden"
      animate={ctx.inView ? "visible" : "hidden"}
      variants={variants}
      className={className}
      {...rest}
    >
      {children}
    </MotionComponent>
  );
}
