
var chemicalStyle = function (opts, skin) {
  var colors;
  skin = skin || opts.skin;

  switch (skin) {
    default:
      colors = {
        tabColor: "#ffffff",
        activeTabColor: "rgba(0, 0, 0, 0.9)",
        tabTextShadow: "#bbbbbb",
        activeTabTextShadow: "#999999",
        activeTabBackgroundColor: "rgba(255, 255, 255, 0.9)",
        activeTabBorderColor: "rgba(0, 0, 0, 0.5)",
        titleTextShadow: "#a6a6a6",
        iconTextShadow: "rgba(0, 0, 0, 0.9)",
        iconColor: "#ffffff"
      }
      break;
  }

  return {
    header: {
      icon: {
        style: {
          color: colors.iconColor,
          textShadow: "2px 2px 2px " + colors.iconTextShadow,
          float: "left"
        }
      },
      box: {
        style: {

        }
      },
      title: {
        style: {
          textShadow: "1px 1px 1px " + colors.titleTextShadow,
          float: "left"
        }
      }
    },
    TabButton: {
      style: {
        borderRadius: "2px 2px 0 0",
        marginLeft: 1
      },
      state: {
        hover: {
          style: {
            backgroundColor: "rgba(224, 230, 240, 0.65)"
          },
          icon: {
            style: {
              color: "rgba(0, 0, 0, 0.9)",
              textShadow: "1px 1px 1px #999999"
            }
          },
          title: {
            style: {
              color: "rgba(0, 0, 0, 0.9)",
              textShadow: "1px 1px 1px #999999"
            }
          }
        }
      },
      mods: {
        active: {
          style: {
            borderColor: colors.activeTabBorderColor,
            backgroundColor: colors.activeTabBackgroundColor
          },
          state: {
            hover: {
              style: {
                backgroundColor: colors.activeTabBackgroundColor
              },
              icon: {
                style: {
                  color: colors.activeTabColor,
                  textShadow: "1px 1px 1px " + colors.activeTabTextShadow
                }
              },
              title: {
                style: {
                  color: colors.activeTabColor,
                  textShadow: "1px 1px 1px " + colors.activeTabTextShadow
                }
              }
            }
          },
          icon: {
            style: {
              color: colors.activeTabColor,
              textShadow: "1px 1px 1px " + colors.activeTabTextShadow
            }
          },
          title: {
            style: {
              color: colors.activeTabColor,
              textShadow: "1px 1px 1px " + colors.activeTabTextShadow
            }
          }
        }
      },
      icon: {
        style: {
          color: colors.tabColor,
          textShadow: "1px 1px 1px " + colors.tabTextShadow
        }
      },
      title: {
        style: {
          color: colors.tabColor,
          textShadow: "1px 1px 1px " + colors.tabTextShadow
        }
      }
    }
  };
}
