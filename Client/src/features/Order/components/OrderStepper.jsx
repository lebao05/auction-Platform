export function OrderStepper({ steps, currentStep }) {
    return (
        <div className="space-y-4">
            {steps.map((step, index) => (
                <div key={step.id} className="flex items-start">
                    {/* Step Circle */}
                    <div
                        className={`flex items-center justify-center w-8 h-8 rounded-full font-semibold text-sm flex-shrink-0 ${index < currentStep
                                ? "bg-green-600 text-white"
                                : index === currentStep
                                    ? "bg-primary text-primary-foreground"
                                    : "bg-muted text-muted-foreground"
                            }`}
                    >
                        {index < currentStep ? "✓" : step.id}
                    </div>

                    {/* Connector and Content */}
                    <div className="ml-4 flex-1">
                        <p className="font-medium text-foreground">{step.title}</p>
                        <p className="text-sm text-muted-foreground">{step.description}</p>

                        {/* Connector Line */}
                        {index < steps.length - 1 && (
                            <div className={`w-1 h-6 ml-3 mt-2 ${index < currentStep ? "bg-green-600" : "bg-border"}`} />
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
}
