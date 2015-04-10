
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
        iconColor: "#ffffff",
        titleColor: "#ffffff",
        toolbarBoxShadow: "rgba(0, 0, 0, 0.1)",
        contentBackgroundColorWithToolbar: "rgba(255, 255, 255, 0.85)",
        footerBackgroundColor: "rgba(224, 230, 240, 0.8)"
      };
      break;
  }

  return {
    Panel: {
      header: {
        style: {
          backgroundColor: "transparent",
          paddingRight: Utils.pixelsOf(opts.headerHeight)
        }
      },
      tabsStart: {
        style: {
          width: 50,
          float: "left"
        }
      },
      tabsEnd: {
        style: {
          width: 10,
          float: "right"
        }
      },
      tabs: {
        style: {
          float: "left"
        }
      },
      icon: {
        style: {
          color: colors.iconColor,
          textShadow: "2px 2px 2px " + colors.iconTextShadow,
          float: "left"
        }
      },
      box: {
        style: {
          float: "left"
        }
      },
      title: {
        style: {
          color: colors.titleColor,
          textShadow: "1px 1px 1px " + colors.titleTextShadow
        }
      },
      body: {
        style: {
          backgroundColor: "transparent",
          borderColor: "rgba(0, 0, 0, 0.5)"
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
    },
    Tab: {
      mods: {
        withToolbar: {
          content: {
            style: {
              backgroundColor: colors.contentBackgroundColorWithToolbar
            }
          }
        }
      },
      toolbar: {
        style: {
          backgroundColor: colors.activeTabBackgroundColor,
          borderBottom: "0 none",
          marginBottom: "1px",
          borderRadius: "2px",
          boxShadow: "0 -2px 0 " + colors.toolbarBoxShadow + " inset"
        }
      },
      content: {
        style: {
          backgroundColor: colors.activeTabBackgroundColor,
          borderBottom: "0 none",
          marginBottom: "1px",
          borderRadius: "2px"
        }
      },
      footer: {
        style: {
          backgroundColor: colors.footerBackgroundColor,
          borderRadius: "2px"
        }
      }
    },
    ToggleButton: {
      style: {
        borderRadius: "2px 2px 0 0",
        backgroundColor: "rgba(255, 255, 255, 0.2)",
        marginLeft: "1px"
      },
      state: {
        hover: {
          style: {
            backgroundColor: "rgba(255, 255, 255, 0.9)"
          },
          children: {
            style: {
              color: "rgba(0, 0, 0, 0.9)",
              textShadow: "1px 1px 1px #ffffff"
            }
          }
        }
      },
      mods: {
        active: {
          style: {
            backgroundColor: "rgba(255, 255, 255, 0.9)"
          }
        }
      },
      children: {
        style: {
          color: "#ffffff",
          textShadow: "1px 1px 1px rgba(0, 0, 0, 0.9)"
        }
      }
    }
  };
};
