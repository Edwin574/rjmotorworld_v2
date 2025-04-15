import MultiStepForm from "@/components/sell/MultiStepForm";

const SellPage = () => {
  return (
    <section className="py-10 bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-8">Sell Your Car</h1>
        <p className="text-center max-w-2xl mx-auto mb-12 text-gray-medium">
          Complete the form below to get a competitive offer for your vehicle. Our process is simple, transparent, and hassle-free.
        </p>
        
        <MultiStepForm />
      </div>
    </section>
  );
};

export default SellPage;
