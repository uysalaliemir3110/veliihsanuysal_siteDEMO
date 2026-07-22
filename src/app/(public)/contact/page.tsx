export default function ContactPage() {
  return (
    <div className="pb-24 md:pb-40 px-6 md:px-12">
      <div className="max-w-4xl space-y-24 md:space-y-36" style={{ paddingLeft: "40px" }}>
        {/* Email */}
        <div className="animate-fade-up">
          <p className="text-[15px] tracking-[0.3em] uppercase text-muted mb-6 font-bold">
            Email
          </p>
          <a
            href="mailto:hello@example.com"
            className="text-xl md:text-4xl lg:text-5xl font-bold leading-[1.2] hover:opacity-50 transition-opacity duration-300"
          >
            hello@example.com
          </a>
        </div>

        {/* Phone */}
        <div className="animate-fade-up-delay-1">
          <p className="text-[15px] tracking-[0.3em] uppercase text-muted mb-6 font-bold">
            Phone
          </p>
          <a
            href="tel:+000000000000"
            className="text-xl md:text-4xl lg:text-5xl font-bold leading-[1.2] hover:opacity-50 transition-opacity duration-300"
          >
            +00 000 000 0000
          </a>
        </div>

        {/* Instagram */}
        <div className="animate-fade-up-delay-2">
          <p className="text-[15px] tracking-[0.3em] uppercase text-muted mb-6 font-bold">
            Instagram
          </p>
          <a
            href="https://instagram.com/studio.placeholder"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xl md:text-4xl lg:text-5xl font-bold leading-[1.2] hover:opacity-50 transition-opacity duration-300"
          >
            @studio.placeholder
          </a>
        </div>

        {/* Address */}
        <div className="animate-fade-up-delay-3">
          <p className="text-[15px] tracking-[0.3em] uppercase text-muted mb-6 font-bold">
            Studio
          </p>
          <p className="text-xl md:text-4xl lg:text-5xl font-bold leading-[1.3]">
            123 Example Street<br />
            Suite 100<br />
            City Center<br />
            Country
          </p>
        </div>
      </div>
    </div>
  );
}
