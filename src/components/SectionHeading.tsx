interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  center?: boolean;
}

const SectionHeading = ({ title, subtitle, center = true }: SectionHeadingProps) => (
  <div className={`mb-10 md:mb-14 ${center ? "text-center" : ""}`}>
    <h2 className="text-2xl md:text-3xl lg:text-4xl font-heading font-bold text-foreground">
      {title}
    </h2>
    {subtitle && (
      <p className="mt-3 text-muted-foreground max-w-2xl mx-auto text-sm md:text-base leading-relaxed">
        {subtitle}
      </p>
    )}
    <div className={`mt-4 h-1 w-16 rounded-full bg-secondary ${center ? "mx-auto" : ""}`} />
  </div>
);

export default SectionHeading;
