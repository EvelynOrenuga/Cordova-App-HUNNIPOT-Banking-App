
document.addEventListener('deviceready',document.getElementById("submit").addEventListener("click",onDeviceReady), false);

function onDeviceReady() {
    // console.log('Running cordova-' + cordova.platformId + '@' + cordova.version);
    document.getElementById('deviceready').classList.add('ready');
    username = document.getElementById("uname").value;
    password = document.getElementById("pwd").value;
    loginbasicOBP(username, password)
    document.getElementById("QuerryBank").addEventListener("click", QuerryBanks);
    document.getElementById("QuerryAccount").addEventListener("click",  QuerryAccounts);
    document.getElementById("QuerryAccount").addEventListener("click",  QuerryAccounts); GETtransaction
    document.getElementById("QuerryTransactions").addEventListener("click",  GETtransaction);
 }

var token;
function loginbasicOBP(a,b) {
    console.log("in function signin");
    document.getElementById("indicator").innerHTML = "Signing in";   
    $.ajax({
        url: "https://apisandbox.openbankproject.com/my/logins/direct",
        type: "POST",
        dataType: "json",
        crossDomain: true,
        cache: false,
        contentType: "application/json; charset=utf-8",
        beforeSend: function(xhr) {
            xhr.setRequestHeader("Authorization",'DirectLogin username="' +a+ '",password="' +b+ '", consumer_key="efwhopkdzw0n2dq1kboh324vyjq11hvqyqcz4hsn"');
        },
        
        success: function (data, textStatus, jQxhr) {
            console.log("in success");
            document.getElementById("indicator").innerHTML = "Successful login. Token: " + data.token;
            token= data.token;
            window.location.href = "#page2";
        },

        error: function (jqXhr, textStatus, errorThrown) {
            console.log("in error");
            document.getElementById("indicator").innerHTML = "error";
        }
    });   
}


$("#myTable").on("click", ".clickable", function() {
    // Get the text content of the clicked cell
    var cellContent = $(this).text();
    
    // Call the queryOBP function with the cellContent as an argument
    queryOBP(cellContent);
});


function QuerryBanks() {
    console.log("getting");
    document.getElementById("indicator").innerHTML = "checking";        
    $.ajax({
        url: "https://apisandbox.openbankproject.com/obp/v4.0.0/banks",
        type: "GET",
        dataType: "json",
        crossDomain: true,
        contentType: "application/json; charset=utf-8",
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Authorization", 'DirectLogin token=' + token);
            xhr.setRequestHeader("Cache-Control", "no-cache, no-store, max-age=0");
        },
        success: function (data, textStatus, jQxhr) {
            console.log("getting");
            console.log(data);
            // clear the table before appending fresh data
            document.getElementById("tablebody").innerHTML = "";
            $("#tablebody").append("<tr><td>Full Name</td ><td>Short Name</td><td>Id</td></tr > ");
            data.banks.forEach(appendRow);
            // document.getElementById("checker2").innerHTML = JSON.stringify(data);
        },

        error: function (jqXhr, textStatus, errorThrown) {
            console.log("retrieving banks");
            document.getElementById("checker2").innerHTML = "Retrieving failed";
        }
    });
}
    
    
function appendRow(bank) {
    $("#tablebody").append("<tr><td><a href='#page3'><button onclick=\"output_bank('" + bank.id + "', '" + bank.short_name + "')\">" + bank.full_name + "</button></a></td><td>" + bank.short_name + "</td><td>" + bank.id + "</td></tr>");
}
    
var bankId;

function output_bank(id, sName) {
    console.log("Bank Id: " + id);
    bankId = id;
    // show the user the selected bank on the input space
    document.getElementById("BankSelect").value = sName;
}


// function to get accounts
function QuerryAccounts() {
    console.log("Retrieving accounts");
    $.ajax({
        url: "https://apisandbox.openbankproject.com/obp/v4.0.0/banks/" + bankId + "/accounts/account_ids/private",
        type:"GET",
        dataType: "json",
        crossDomain: true,
        contentType: "application/json; charset=utf-8",
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Authorization", 'DirectLogin token=' + token);
            xhr.setRequestHeader("Cache-Control", "no-cache, no-store, max-age=0");
        },
        success: function (data, textStatus, jQxhr) {
            console.log("Getting");
            console.log(data);
            // clear the table before appending fresh data
            document.getElementById("accountTablebody").innerHTML = "";
            data.accounts.forEach(appendAccounts);
            console.log("appending success");
        },

        error: function (jqXhr, textStatus, errorThrown) {
            console.log("Error");
        }
    });
}

//  function to appen account
function appendAccounts(account) {
    $("#accountTablebody").append("<tr><td><a href='#page3'><button onclick=\"output_account('" + account.id + "')\">" + account.id + "</button></a></td></tr>");
}

var accountId;


function output_account(b) {
    console.log("Account id: " + b);
    accountId = b;
    // show the user the selected account on the input space
    document.getElementById("AccountSelect").value = b;
}


//  define a fucntion to get the transactions of an account.
function GETtransaction() { 
    console.log("Get transactions");
    $.ajax({
        url: "https://apisandbox.openbankproject.com/obp/v5.0.0/my/banks/"+bankId+"/accounts/"+accountId+"/transactions",
        type: "GET",
        dataType:"json",
        crossDomain: true,
        contentType:"application/json; charset=utf-8",

        beforeSend: function(xhr) {
        xhr.setRequestHeader("Authorization", 'DirectLogin token=' + token);
        xhr.setRequestHeader("Cache-Control", "no-cache, no-store, max-age=0");
        },

        success: function( data, textStatus, jQxhr ){
        console.log("Transactions retrieved successfully");
        console.log(data);
        // clear tables before appending fresh data
        document.getElementById("transactionTableHead").innerHTML = ""; 
        document.getElementById("transactionsTableBody").innerHTML = "";
        // append new header and body rows
        $("#transactionTableHead").append("<tr><th>DateTime (UTC)</th> <th>Description</th> <th>Currency</th> <th>Amount</th> <th>Balance</th>  </tr>");
        data.transactions.forEach(appendTransactions)
        },

        error: function( jqXhr, textStatus, errorThrown ){
        console.log("Error retrieving transactions"); 
        }
    });
}


//  fucntion to append transactions
function appendTransactions(transactions) {
    $("#transactionsTableBody").append("<tr><td style='text-align: center;' >" + transactions.details.completed +"</td><td>" 
    + transactions.details.description  +"</td><td>" 
    + transactions.details.value.currency +"</td><td>" 
    + transactions.details.value.amount +"</td><td>" 
    + transactions.details.new_balance.amount +"</td></tr>");
}