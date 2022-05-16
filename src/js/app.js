
App = {
  web3Provider: null,
  contracts: {},
  
  init: async function() {
   
    return await App.initWeb3();
  },

  initWeb3: async function() {
  
    if (window.ethereum) {
      App.web3Provider = window.ethereum;
      try {
        // Request account access
        await window.ethereum.request({ method: "eth_requestAccounts" });;
      } catch (error) {
        // User denied account access...
        console.error("User denied account access")
      }
    }
    // Legacy dapp browsers...
    else if (window.web3) {
      App.web3Provider = window.web3.currentProvider;
    }
    // If no injected web3 instance is detected, fall back to Ganache
    else {
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
    }

    App.initContract();
    
  },

  initContract: function() {
    $.getJSON('FabricaLeilao.json', function(data) {
      // Get the necessary contract artifact file and instantiate it with @truffle/contract
      var SaleArtifact = data;
      App.contracts.Sale = TruffleContract(SaleArtifact);
    
      // Set the provider for our contract
      App.contracts.Sale.setProvider(App.web3Provider);
      return App.bindEvents();

    });
    
  },
  bindEvents: function() {
    $(document).on('click', '.btn-novo-leilao', App.novoLeilao);
    $(document).on('click', '.btn-iniciar-leilao', App.inicialLelao);
    $(document).on('click', '.btn-lance', App.handleLance);
    $(document).on('click', '.btn-saque', App.handleWithdraw);
    $(document).on('click', '.btn-finalizar', App.handleEnd);
    
    App.listarLeioes();
  },
  handleLance: async function(event)  {
  

    var saleInstance;
   web3 = new Web3(App.web3Provider);
    web3.eth.getAccounts(async function(error, accounts) {
      if (error) {
        console.log(error);
      }
      
      
      var account = accounts[0];
      var valorLance = $(".valor-lance").val();
      valorLance = web3.utils.toWei(valorLance,'ether');
      App.contracts.Sale.deployed().then(async function(instance) {
        saleInstance = instance;
        var gasLimit=await  saleInstance.bid.estimateGas( {from: account, value:valorLance});
        gasLimit+= 100000;
        
        const gasPrice = await web3.eth.getGasPrice();
        
        return saleInstance.bid( {from: account,value: valorLance, gas:gasLimit});
        const latestBlock = await web3.eth.getBlock('latest');
        const blockGas = latestBlock.gasLimit;
        const finalGas = (blockGas * resGasMethod);
        const finalGasInEther = web3.utils.fromWei(finalGas.toString(), 'ether');
        // Execute adopt as a transaction by sending account
        
      }).then(async function(result) {
        
        
        App.markAdopted();
        
        
        
      }).catch(function(err) {
        alert(err.message);
      });
    });
    /*
     * Replace me...
     */
  },
  markAdopted: function() {
    web3 = new Web3(App.web3Provider);
    var adoptionInstance;
    App.contracts.Sale.deployed().then(function(instance) {
      adoptionInstance = instance;
      return adoptionInstance.getHighest.call();
    }).then(function(people) {
      $(".Maior-Lance").text("Maior Lance: " + web3.utils.fromWei(people.bidValue));
      $(".Dono-lance").text("Dono do Maior Lance: " + people.bidder);
      var lancesInstance;
      App.contracts.Sale.deployed().then(function(instance) {
        lancesInstance = instance;
        return lancesInstance.getLances.call();
      }).then(function(lances) {

// have the exact same length.
        const numPeople = lances.length

// for clarity's sake, let's define some constants so that we can see
// which field array we're accessing:
        const FIELD_ADDR  = 0
        const FIELD_FUNDS = 1
        var html="<table><tr><td>Dono</td><td>valor</td></tr>";
        let lancesStructs = []
        for (let i = 0; i < numPeople; i++) {
          var petId= lances[i][FIELD_ADDR];
          var buyer = lances[i][FIELD_FUNDS];
          if (buyer !== '0x0000000000000000000000000000000000000000') {
            
            html+="<tr><td>" + buyer + "</td><td>" + web3.utils.fromWei(petId, 'ether'); + "</td></tr>";
          }
        }
          
        $(".lances").html(html);
              }).catch(function(err) {
                console.log(err.message);
              });
    }
    )},
  handleWithdraw: async function(event) {
    var saleInstance;
    var web3 = new Web3(App.web3Provider);
    web3.eth.getAccounts(async function(error, accounts) {
      if (error) {
        console.log(error);
      }
      
      var account = accounts[0];
  
      App.contracts.Sale.deployed().then(async function(instance) {
        saleInstance = instance;
        var gasLimit=await  saleInstance.widthdraw.estimateGas({from: account});
        gasLimit+= 100000;
    
        const gasPrice = await web3.eth.getGasPrice();
        
        return saleInstance.widthdraw( {from: account,gas:gasLimit});
        const latestBlock = await web3.eth.getBlock('latest');
        const blockGas = latestBlock.gasLimit;
        const finalGas = (blockGas * resGasMethod);
        const finalGasInEther = web3.utils.fromWei(finalGas.toString(), 'ether');
        // Execute adopt as a transaction by sending account
        
      }).then(async function(result) {
        
        
          alert('Saque realizado com sucesso')
        
        
        
      }).catch(function(err) {
        alert(err.message);
      });
    });
  },
  handleEnd: async function(event) {
    var saleInstance;
    var web3 = new Web3(App.web3Provider);
    web3.eth.getAccounts(async function(error, accounts) {
      if (error) {
        console.log(error);
      }
      
      var account = accounts[0];
  
      App.contracts.Sale.deployed().then(async function(instance) {
        saleInstance = instance;
        var gasLimit=await  saleInstance.end.estimateGas({from: account});
        gasLimit+= 100000;
        const gasPrice = await web3.eth.getGasPrice();
        
        return saleInstance.end( {from: account,gas:gasLimit});
        const latestBlock = await web3.eth.getBlock('latest');
        const blockGas = latestBlock.gasLimit;
        const finalGas = (blockGas * resGasMethod);
        const finalGasInEther = web3.utils.fromWei(finalGas.toString(), 'ether');
        // Execute adopt as a transaction by sending account
        
      }).then(async function(result) {
        
        
          alert('Leilão finalizado com sucesso')
        
        
        
      }).catch(function(err) {
        alert(err.message);
      });
    });
  },
  inicialLelao: async function(event) {
  
    event.preventDefault();

    var leilaoId = parseInt($(event.target).data('id'));
    var saleInstance;
    var web3 = new Web3(App.web3Provider);
    web3.eth.getAccounts(async function(error, accounts) {
      if (error) {
        console.log(error);
      }
      
      var account = accounts[0];
  
      App.contracts.Sale.deployed().then(async function(instance) {
        saleInstance = instance;
        var urlToken = $(".url-token").val();
        var gasLimit=await  saleInstance.start.estimateGas(0,urlToken, {from: account});
        gasLimit+= 100000;
        const gasPrice = await web3.eth.getGasPrice();
        
        return saleInstance.start(gasPrice *gasLimit ,urlToken, {from: account,gas:gasLimit});
        const latestBlock = await web3.eth.getBlock('latest');
        const blockGas = latestBlock.gasLimit;
        const finalGas = (blockGas * resGasMethod);
        const finalGasInEther = web3.utils.fromWei(finalGas.toString(), 'ether');
        // Execute adopt as a transaction by sending account
        
      }).then(async function(result) {
        
        
        App.markAdopted();
        
        
        
      }).catch(function(err) {
        alert(err.message);
      });
    });
    /*
     * Replace me...
     */
  },
  novoLeilao: async function(event) {
  

    var saleInstance;
    var web3 = new Web3(App.web3Provider);
    web3.eth.getAccounts(async function(error, accounts) {
      if (error) {
        console.log(error);
      }
      
      var account = accounts[0];
  
      App.contracts.Sale.deployed().then(async function(instance) {
        saleInstance = instance;
        var minter = $(".minter").val();
        gasLimit= 10000*10;
        const gasPrice = await web3.eth.getGasPrice();
        
        return saleInstance.novoLeilao(minter, {from: account,gas:gasLimit});
        const latestBlock = await web3.eth.getBlock('latest');
        const blockGas = latestBlock.gasLimit;
        const finalGas = (blockGas * resGasMethod);
        const finalGasInEther = web3.utils.fromWei(finalGas.toString(), 'ether');
        // Execute adopt as a transaction by sending account
        
      }).then(async function(result) {
        
        
        App.listarLeioes();
        
        
        
      }).catch(function(err) {
        console.log(err.message);
        alert(err.message);
      });
    });
    /*
     * Replace me...
     */
  },
  listarLeioes: function() {
    web3 = new Web3(App.web3Provider);
      var lancesInstance;
      App.contracts.Sale.deployed().then(function(instance) {
        lancesInstance = instance;
        return lancesInstance.listarLances.call();
      }).then(function(lances) {

// have the exact same length.
        const numPeople = lances.length

// for clarity's sake, let's define some constants so that we can see
// which field array we're accessing:
        var petsRow = $('#petsRow');
        var petTemplate = $('#leilaoTemplate');
        for (let i = 0; i < numPeople; i++) {
          
          const urlToken = lances[i][1];
          
          $.getJSON(urlToken, function(data) {
            // Get the necessary contract artifact file and instantiate it with @truffle/contract
            const IdDLeilao = lances[i][0];    
            const iniciado = lances[i][2];
            const maiorLance = web3.utils.fromWei(lances[i][3], 'ether');
            const donoLance = lances[i][4];
            if (donoLance!== '0x0000000000000000000000000000000000000000') {
            
              petTemplate.find('.panel-title').text("Leilão No:" + IdDLeilao);
              petTemplate.find('img').attr('src', data.image);
              petTemplate.find('.maior-lance').text(maiorLance);
              petTemplate.find('.dono-maior-lance').text(donoLance);
              petTemplate.find('.btn-lance').attr('data-id',IdDLeilao );
              petTemplate.find('.btn-iniciar-leilao').attr('data-id',IdDLeilao );
              petTemplate.find('.btn-finalizar').attr('data-id',IdDLeilao );
              var inicadoDesc= "Não"; 
              if (iniciado ){
                  inicadoDesc = "Sim";
              }
              petTemplate.find('.iniciado').text(inicadoDesc);
              petsRow.append(petTemplate.html());
            }
          });
          
        }
        /*
         <div id="leilaoTemplate" style="display: none;">d
      <div class="col-sm-6 col-md-4 col-lg-3">
        <div class="panel panel-default panel-pet">
          <div class="panels-heading">
            <h3 class="panel-title">Scrappy</h3>
          </div>
          <div class="panel-body">
            <img alt="140x140" data-src="holder.js/140x140" class="img-rounded img-center" style="width: 100%;" src="https://animalso.com/wp-content/uploads/2017/01/Golden-Retriever_6.jpg" data-holder-rendered="true">
            <br/><br/>
            <strong>Maior Lance</strong>: <span class="">0.0</span><br/>
            <strong>Dono MAior Lance</strong>: <span class="">0x0</span><br/>
            <button class="btn btn-default btn-iniciar-leilao" type="button" data-id="0" data-price="0.00">Iniciar Leilão</button>
            <input type="text" class="valor-lance" ><button class="btn btn-default ">Dar um lance</button></span><br/>
            <button class="btn btn-default btn-finalizar">finalizar</button><br>
            <button class="btn btn-default btn-saque">Sacar</button>
          </div>
        </div>
      </div>
        */

          }).catch(function(err) {
                console.log(err.message);
              });
    }
   

};
$(function() {
  $(window).load(function() {
    App.init();
  });
});
