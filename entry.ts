// <api-registrations>
app.get("/api/health", healthGet);
// </api-registrations>
app.use("/api/auth", authRouter);
app.use("/api/schemes", schemesRouter);
app.use("/api/crops", cropsRouter);
app.use("/api/livestock", livestockRouter);
app.use("/api/consultations", consultationsRouter);
app.use("/api/diseases", diseasesRouter);
app.use("/api/chat", chatRouter);
app.use("/api/weather", weatherRouter);
app.use("/api/market-prices", marketPricesRouter);
app.use("/api/vaccinations", vaccinationsRouter);
app.use("/api/notifications", notificationsRouter);
app.use("/api/disease-detection", diseaseDetectionRouter);
app.use("/api/admin", adminRouter);
// </api-registrations>
// Initialize DB and seed
connectDB().then(() => seedDatabase()).catch(console.error);
