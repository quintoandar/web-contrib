const currentDate = new Date();

module.exports = {
  isRunningAnalyze: process.argv.indexOf('--json') >= 0,
  isBuildingDll: Boolean(process.env.BUILDING_DLL),
  skipSsr: Boolean(process.env.SKIP_SSR),
  getBuild: () => {
    const buildStarted = process.env.DRONE_BUILD_STARTED;
    const buildDate = buildStarted ? new Date(Number(buildStarted) * 1000) : currentDate;
    return buildDate.toISOString();
  },
};
