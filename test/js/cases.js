var trioAddress = '0xD68C8a6Efec16180F4989DFB683d48Dfd2B0ED7d';
var pointsAddress = '0x766d8203c9a8fdef8ab10627c63a52501f2c7ced';
window.addEventListener("load", function() {
    var Web3 = require('web3');
    // Checking if Web3 has been injected by the browser (Mist/MetaMask)
    if (typeof web3 !== "undefined") {
        // Use Mist/MetaMask's provider
        window.web3 = new Web3(web3.currentProvider);
    } else {
        console.log("No web3? You should consider trying MetaMask!");
        // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
        window.web3 = new Web3(new providers.HttpProvider("http://192.168.3.87:8545"));
    }

    showNetwork();

    getBlockNumber();
    getBalance();
    var timer = setInterval(function() {
        getBlockNumber();
        getBalance();
    }, 3000);

    myPointsContracts();

    trioTransferable();
});


function showNetwork() {
    web3.version.getNetwork((err, res) => {
      var output = "";
  
      if (!err) {
        if(res > 1000000000000) {
          output = "testrpc";
        } else {
          switch (res) {
            case "1":
              output = "mainnet";
              break
            case "2":
              output = "morden";
              break
            case "3":
              output = "ropsten";
              break
            case "4":
              output = "rinkeby";
              break
            default:
              output = "unknown network = "+res;
          }
        }
      } else {
        output = "Error";
      }
      document.getElementById('currentNetwork').innerText = "Network = " + output;
    })
}

function filter(event) {
    var value = JSON.stringify(event, undefined, 2);
    document.getElementById("filtercontent").innerHTML += '<pre>' + value + '</pre>';
    document.getElementById("filtercontent").innerHTML += "<div style='background-color:#fff;height:1px;width:100%'></div>";
}

function getBalance() {
    // 获取MetaMask当前账户
    web3.eth.getAccounts(function(error, accounts) {
        if (!error) {
            // 获取当前账户的余额
            web3.eth.getBalance(accounts[0], function(error, balance) {
                if (!error) {
                    var balanceValue = balance.toNumber() / 1000000000000000000;
                    document.getElementById("balance").innerText = accounts[0] + " : " + balanceValue + "ETH";
                } else {
                    console.error(error);
                }
            });
        } else {
            console.error(error);
        }
    });
}

function getBalanceOf() {
    var account = document.getElementById('balanceAccount').value;
    // 获取当前账户的余额
    web3.eth.getBalance(account, function(error, balance) {
        if (!error) {
            var balanceValue = balance.toNumber() / 1000000000000000000;
            document.getElementById("balanceOf").innerText = account + " : " + balanceValue + "ETH";
        } else {
            console.error(error);
        }
    });
}

function transferTo() {
    document.getElementById('transactionResponse').innerText = '';
    web3.eth.getAccounts(function(error, accounts) {
        if (!error) {
            var fromAccount = accounts[0];
            var toAccount = document.getElementById('transferTo').value;
            var amount = document.getElementById('transferValue').value;

            //
            var gas = "35000";
            var gasPrice = "21000000000";

            if (fromAccount != null && fromAccount.length > 0 &&
                toAccount != null && toAccount.length > 0 &&
                amount != null && amount.length > 0 &&
                gas != null && gas.length > 0 &&
                gasPrice != null && gasPrice.length > 0) {
                // Example 1: Using the default MetaMask gas and gasPrice
                var message = {from : fromAccount, to : toAccount, value : web3.toWei(amount, 'ether')};

                // Example 2: Setting gas and gasPrice
                //var message = {from: fromAccount, to:toAccount, value: web3.toWei(amount, 'ether'), gas: gas, gasPrice: gasPrice};

                // Example 3: Using the default account
                //web3.eth.defaultAccount = fromAccount;
                //var message = {to:toAccount, value: web3.toWei(amount, 'ether')};

                web3.eth.sendTransaction(message, (err, res)=> {
                    var output = "";
                    if (!err) {
                        output += res;
                    } else {
                        output = "Error";
                    }
                    document.getElementById('transactionResponse').innerText = "Transaction response= " + output;
                })
            } else {
                document.getElementById('transactionResponse').innerText = "数据校验未通过！";
            }
        }else {
            document.getElementById('transactionResponse').innerText = error;
        }
    });
}

function getBlockNumber() {
    web3.eth.getBlockNumber((err, res) => {
        var output = "";
        if (!err) {
          output = res;
        } else {
          output = "Error";
        }
        document.getElementById('blockNumber').innerText = "Current block number = " + output;
    });
}

function getTrioBalance() {
    document.getElementById("trioBalance").innerText = '';
    web3.eth.getAccounts(function(error, accounts) {
        if (!error) {
            var fromAccount = accounts[0];
            var trioContract = web3.eth.contract(tripioTokenABI);
            var trioContractInstance = trioContract.at(trioAddress);
            trioContractInstance.symbol(function(error0, symbol) {
                if(!error0) {
                    trioContractInstance.balanceOf(fromAccount, function(error1, value) {
                        if(!error1) {
                            document.getElementById("trioBalance").innerText = fromAccount + " : " + value.toString(10) + symbol;
                        }else {
                            document.getElementById("trioBalance").innerText = error;
                        }
                    });
                }else {
                    document.getElementById("trioBalance").innerText = error;
                }
            });
        }
    });
}

function trioTransferable() {
    document.getElementById("trioTransferable").innerText = '';
    web3.eth.getAccounts(function(error, accounts) {
        if (!error) {
            var trioContract = web3.eth.contract(tripioTokenABI);
            var trioContractInstance = trioContract.at(trioAddress);
            trioContractInstance.transferable(function(error0, result) {
                if(!error0) {
                    document.getElementById("trioTransferable").innerText = "Transferable: " + result.toString();
                }else {
                    document.getElementById("trioTransferable").innerText = error;
                }
            });

        }
    });
}

function trioEnableTransfer() {
    web3.eth.getAccounts(function(error, accounts) {
        if (!error) {
            var fromAccount = accounts[0];
            var trioContract = web3.eth.contract(tripioTokenABI);
            var trioContractInstance = trioContract.at(trioAddress);
            trioContractInstance.enableTransfer({from: fromAccount}, function(error0, result) {
                if(!error0) {

                }else {
                    document.getElementById("trioTransferable").innerText = error;
                }
            });

             // event
             var event = trioContractInstance.EnableTransfer(function(error, result) {
                filter(result);
                event.stopWatching();
                trioTransferable();
            });
        }
    });
}

function disableTransfer() {
    web3.eth.getAccounts(function(error, accounts) {
        if (!error) {
            var fromAccount = accounts[0];
            var trioContract = web3.eth.contract(tripioTokenABI);
            var trioContractInstance = trioContract.at(trioAddress);
            trioContractInstance.disableTransfer({from: fromAccount}, function(error0, result) {
                if(!error0) {

                }else {
                    document.getElementById("trioTransferable").innerText = error;
                }
            });

            // event
            var event = trioContractInstance.DisableTransfer(function(error, result) {
                filter(result);
                event.stopWatching();
                trioTransferable();
            });
        }
    });
}

function trioTransferTo() {
    document.getElementById("trioTransferResult").innerText = "";
    web3.eth.getAccounts(function(error0, accounts) {
        if (!error0) {
            var fromAccount = accounts[0];
            var toAccount = document.getElementById('trioTransferTo').value;
            var amount = document.getElementById('trioTransferValue').value;
            if (toAccount != null && toAccount.length > 0 && amount != null && amount.length > 0) {
                var trioContract = web3.eth.contract(tripioTokenABI);
                var trioContractInstance = trioContract.at(trioAddress);
                trioContractInstance.transfer(toAccount, amount,{from: fromAccount}, function(error, result) {
                    if (error) {
                        document.getElementById("trioTransferResult").innerText = error;
                    } else {
                        document.getElementById("trioTransferResult").innerText = result;
                    }
                });

                // event
                var event = trioContractInstance.Transfer(function(error, result) {
                    filter(result);
                    event.stopWatching();
                });

            }else {
                document.getElementById("trioTransferResult").innerText = '数据校验未通过！';
            }
        }else {
            document.getElementById("trioTransferResult").innerText = error0;
        }
    });

}

function trioTransferFrom() {
    document.getElementById("trioTransferFromResult").innerText = "";
    web3.eth.getAccounts(function(error0, accounts) {
        if (!error0) {
            var execAccount = accounts[0];
            var fromAccount = document.getElementById('trioTransfer2From').value;
            var toAccount = document.getElementById('trioTransfer2To').value;
            var amount = document.getElementById('trioTransfer2Value').value;
            if (toAccount != null && 
                toAccount.length > 0 && 
                fromAccount != null &&
                fromAccount.length > 0 &&
                amount != null &&
                amount.length > 0) {
                var trioContract = web3.eth.contract(tripioTokenABI);
                var trioContractInstance = trioContract.at(trioAddress);
                trioContractInstance.transferFrom(fromAccount, toAccount , amount,{from: execAccount}, function(error, result) {
                    if (error) {
                        document.getElementById("trioTransferFromResult").innerText = error;
                    } else {
                        document.getElementById("trioTransferFromResult").innerText = result;
                    }
                });

                // event
                var event = trioContractInstance.Transfer(function(error, result) {
                    filter(result);
                    event.stopWatching();
                });
            }else {
                document.getElementById("trioTransferFromResult").innerText = '数据校验未通过！';
            }
        }else {
            document.getElementById("trioTransferFromResult").innerText = error0;
        }
    });
    
}

function trioApprove() {
    document.getElementById("trioApproveResult").innerText = "";
    web3.eth.getAccounts(function(error0, accounts) {
        if (!error0) {
            var fromAccount = accounts[0];
            var toAccount = document.getElementById('approveTo').value;
            var amount = document.getElementById('approveValue').value;
            if (toAccount != null && toAccount.length > 0 && amount != null && amount.length > 0) {
                var trioContract = web3.eth.contract(tripioTokenABI);
                var trioContractInstance = trioContract.at(trioAddress);
                trioContractInstance.approve(toAccount, amount,{from: fromAccount}, function(error, result) {
                    if (error) {
                        document.getElementById("trioApproveResult").innerText = error;
                    } else {
                        document.getElementById("trioApproveResult").innerText = result;
                    }
                });

                // event
                var event = trioContractInstance.Approval(function(error, result) {
                    filter(result);
                    event.stopWatching();
                });
            }else {
                document.getElementById("trioApproveResult").innerText = '数据校验未通过！';
            }
        }else {
            document.getElementById("trioApproveResult").innerText = error0;
        }
    });
}

function myPointsContracts() {
    document.getElementById("mypointscontracts").innerHTML = "";
    web3.eth.getAccounts(function(error0, accounts) {
        if (!error0) {
            var fromAccount = accounts[0];
            var pointsContract = web3.eth.contract(pointsABI);
            var pointsContractInstance = pointsContract.at(pointsAddress);
            pointsContractInstance.ownedContracts({from: fromAccount}, function(error, result) {
                if (error) {
                    document.getElementById("mypointscontracts").innerHTML = error;
                } else {
                    var contracts = "";
                    for (var index in result) {
                        contracts += "<div>" + result[index]  + "</div>";
                    }
                    document.getElementById("mypointscontracts").innerHTML = contracts;
                }
            });
        }else {
            document.getElementById("mypointscontracts").innerHTML = error0;
        }
    });
}

// {/* <input id='pointsContractAddress' class="input" type="text" placeholder="合约地址">
//         <button class="confirm" onclick="pointsContractInfo()">查询</button>
//         <div id="pointsContractInfo" class="result"></div> */}

function pointsContractInfo() {
    document.getElementById("pointsContractInfo").innerHTML = "";
    web3.eth.getAccounts(function(error0, accounts) {
        if (!error0) {
            var fromAccount = accounts[0];

            var address = document.getElementById('pointsContractAddress').value;

            var pointsContract = web3.eth.contract(pointsABI);
            var pointsContractInstance = pointsContract.at(pointsAddress);
            pointsContractInstance.contracts(address, {from: fromAccount}, function(error, result) {
                if (error) {
                    document.getElementById("pointsContractInfo").innerHTML = error;
                } else {
                    var contractInfo = "<div>ads:   " + address + "</div>";
                    contractInfo    += '<div>owner: ' + result[0] +'</div>';
                    contractInfo    += '<div>rate:  ' + result[1].toString(10) +'</div>';
                    document.getElementById("pointsContractInfo").innerHTML = contractInfo;
                }
            });
        }else {
            document.getElementById("pointsContractInfo").innerHTML = error0;
        }
    });
}

function createPoints() {
    document.getElementById("createPointsResult").innerText = "";
    web3.eth.getAccounts(function(error0, accounts) {
        if (!error0) {
            var fromAccount = accounts[0];
            var symbol = document.getElementById('createPointsSymbol').value;
            var name = document.getElementById('createPointsName').value;
            var decimal = document.getElementById('createPointsDecimal').value;
            var rate = document.getElementById('createPointsRate').value;

            if (symbol != null && 
                symbol.length > 0 && 
                name != null && 
                name.length > 0 &&
                decimal != null &&
                decimal.length > 0 &&
                rate != null &&
                rate.length > 0) {
                    var pointsContract = web3.eth.contract(pointsABI);
                    var pointsContractInstance = pointsContract.at(pointsAddress);

                    pointsContractInstance.createPointsContract(symbol, name, decimal, rate, {from: fromAccount}, function(error, result) {
                        if (error) {
                            document.getElementById("createPointsResult").innerText = error;
                        } else {
                            document.getElementById("createPointsResult").innerText = result;
                        }
                    });

                    // event
                    var event = pointsContractInstance.CreateContract(function(error, result) {
                        filter(result);
                        event.stopWatching();
                        myPointsContracts();
                    });
            }else {
                document.getElementById("createPointsResult").innerText = '数据校验未通过！';
            }
        }else {
            document.getElementById("createPointsResult").innerText = error0;
        }
    });
}

function exchange() {
    // <span class="tips">用TRIO兑换积分(exchange)</span>
    //     <input id='exchangeAddress' class="input" type="text" placeholder="积分合约地址">
    //     <input id='exchangeToken' class="input" type="text" placeholder="TRIO数量">
    //     <input id='exchangeTime' class="input" type="text" placeholder="冻结时间">
    //     <button class="confirm" onclick="exchange()">兑换</button>
    //     <span id="exchangeResult" class="result"></span>

    document.getElementById("exchangeResult").innerText = "";
    web3.eth.getAccounts(function(error0, accounts) {
        if (!error0) {
            var fromAccount = accounts[0];

            var exchangeAddress = document.getElementById('exchangeAddress').value;
            var exchangeToken = document.getElementById('exchangeToken').value;
            var exchangeTime = document.getElementById('exchangeTime').value;

            if (exchangeAddress != null && 
                exchangeAddress.length > 0 && 
                exchangeToken != null && 
                exchangeToken.length > 0 &&
                exchangeTime != null &&
                exchangeTime.length > 0) {

                    var trioContract = web3.eth.contract(tripioTokenABI);
                    var trioContractInstance = trioContract.at(trioAddress);
                    trioContractInstance.approve(pointsAddress, exchangeToken,{from: fromAccount}, function(error, result) {
                        if (error) {
                            document.getElementById("exchangeResult").innerText = error;
                        } else {
                            document.getElementById("exchangeResult").innerText = result;
                        }
                    });

                    // event
                    var event1 = trioContractInstance.Approval(function(error, result) {
                        filter(result);
                        event1.stopWatching();

                        var pointsContract = web3.eth.contract(pointsABI);
                        var pointsContractInstance = pointsContract.at(pointsAddress);
                        pointsContractInstance.exchange(exchangeAddress, exchangeToken, exchangeTime, {from: fromAccount}, function(error, result) {
                            if (error) {
                                document.getElementById("exchangeResult").innerText = error;
                            } else {
                                document.getElementById("exchangeResult").innerText = result;
                            }
                        });

                        var event2 = pointsContractInstance.Exchange(function(error, result) {
                            filter(result);
                            event2.stopWatching();
                        });

                    });
                }
        }else {
            document.getElementById("exchangeResult").innerText = error0;
        }
    });
}


// {/* <span class="tips">查询某合约的未冻结积分(totalUnlockedTokens)</span>
//         <input id='unlockedContract' class="input" type="text" placeholder="积分合约地址">
//         <button class="confirm" onclick="totalUnlockedTokens()">查询</button>
//         <span id="totalUnlockedTokensResult" class="result"></span> */}

function totalUnlockedTokens() {
    document.getElementById("totalUnlockedTokensResult").innerHTML = "";
    web3.eth.getAccounts(function(error0, accounts) {
        if (!error0) {
            var fromAccount = accounts[0];
            var unlockedContract = document.getElementById('unlockedContract').value;

            var pointsContract = web3.eth.contract(pointsABI);
            var pointsContractInstance = pointsContract.at(pointsAddress);
            pointsContractInstance.totalUnlockedTokens(unlockedContract, {from: fromAccount}, function(error, result) {
                if (error) {
                    document.getElementById("totalUnlockedTokensResult").innerHTML = error;
                } else {
                    document.getElementById("totalUnlockedTokensResult").innerHTML = result;
                }
            });
        }else {
            document.getElementById("mypointscontracts").innerHTML = error0;
        }
    });
}


// {/* <input id='redeemContract' class="input" type="text" placeholder="积分合约地址">
//             <input id='redeemPoints' class="input" type="text" placeholder="积分数量">
//             <button class="confirm" onclick="redeem()">查询</button>
//             <span id="redeemResult" class="result"></span> */}

function redeem() {
    document.getElementById("redeemResult").innerHTML = "";
    web3.eth.getAccounts(function(error0, accounts) {
        if (!error0) {
            var fromAccount = accounts[0];
            var redeemContract = document.getElementById('redeemContract').value;
            var redeemPoints = document.getElementById('redeemPoints').value;

            var pointsContract = web3.eth.contract(pointsABI);
            var pointsContractInstance = pointsContract.at(pointsAddress);
            pointsContractInstance.redeem(redeemContract, redeemPoints, {from: fromAccount}, function(error, result) {
                if (error) {
                    document.getElementById("redeemResult").innerHTML = error;
                } else {
                    document.getElementById("redeemResult").innerHTML = result;
                }
            });

            var event2 = pointsContractInstance.Redeem(function(error, result) {
                filter(result);
                event2.stopWatching();
            });
        }else {
            document.getElementById("redeemResult").innerHTML = error0;
        }
    });
}

